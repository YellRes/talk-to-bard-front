import BaseLLam from "./baseLLam";
import { ChatMessage } from "@ant-design/pro-chat";

const API_KEY = process.env.API_KEY_QWEN;
export default class Qwen extends BaseLLam<any, ChatMessage[], ReadableStream> {
  async request(messages: ChatMessage[]): Promise<Response> {
    const data = await fetch(
      "/qWenApi/v1/services/aigc/text-generation/generation",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-DashScope-SSE": "enable",
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          input: {
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant.",
              },
              ...messages,
            ],
          },
          parameters: {
            incremental_output: true,
          },
        }),
      },
    );

    return this.handleResponse(data.body as ReadableStream);
  }

  handleResponse(response: ReadableStream): Response {
    const streamData = response.getReader();

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new Response(
      new ReadableStream({
        start: async (controller) => {
          const push = async () => {
            const { value, done } = await streamData.read();
            if (done) {
              controller.close();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            const data = this.getResult(chunk);
            controller.enqueue(encoder.encode(data.output.text));
            push();
          };

          push();
        },
      }),
    );
  }

  getResult(text: string) {
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = JSON.parse(line.slice(5));
        return data;
      }
    }
  }
}
