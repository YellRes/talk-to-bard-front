import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY!);
export default async function request(params: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = params;
  const result = await model.generateContentStream(prompt);

  // let text = '';
  // for await (const chunk of result.stream) {
  //     const chunkText = chunk.text();
  //     text += chunkText;
  // }
  return result.stream;
}

// 多轮聊天
export type multiChatParams = {
  history: Array<{
    role: "user" | "model";
    parts: string;
  }>;
  currentParts: string;
};
export async function multipleChatRequest(params: multiChatParams) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const { history, currentParts } = params;

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessageStream(currentParts);
  return result.stream;
}
