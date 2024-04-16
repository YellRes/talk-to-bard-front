import BaseLLam from "./baseLLam";
import {
  GenerativeModel,
  GoogleGenerativeAI,
  ModelParams,
  GenerateContentStreamResult,
} from "@google/generative-ai";
import { ChatMessage } from "@ant-design/pro-chat";

const API_KEY = process.env.API_KEY_GEMINI;

// 多轮聊天传参
export type multiChatParams = {
  history: Array<{
    role: "user" | "model";
    parts: string;
  }>;
  currentParts: string;
};

export default class Gemini extends BaseLLam<
  GenerativeModel,
  ChatMessage<multiChatParams>[],
  GenerateContentStreamResult
> {
  constructor(modelName: ModelParams) {
    super(new GoogleGenerativeAI(API_KEY!).getGenerativeModel(modelName));
  }

  async request(messages: ChatMessage[]): Promise<Response> {
    // 获取历史消息和本次消息
    const multiChatContent = (messages || []).reduce(
      (pre: multiChatParams, cur, index) => {
        const { role } = cur;
        const content = cur.content as string;

        if (index === messages.length - 1) {
          // 当前消息
          pre.currentParts = content;
        } else {
          // 历史消息
          pre.history.push({
            role: role === "user" ? "user" : "model",
            parts: content,
          });
        }
        return pre;
      },
      {
        history: [],
        currentParts: "",
      },
    );

    const { history, currentParts } = multiChatContent;
    const chat = this.model.startChat({
      history,
    });
    const result = await chat.sendMessageStream(currentParts);
    return this.handleResponse(result);
  }

  handleResponse(response: GenerateContentStreamResult): Response {
    const { stream } = response || {};
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          try {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          } catch (err) {
            console.error("读取流中的数据时发生错误", err);
            controller.error(err);
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream);
  }
}
