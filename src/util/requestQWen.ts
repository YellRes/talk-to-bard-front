import axios from "axios";

const API_KEY = process.env.API_KEY_QWEN;
export async function requestQwen(params: any) {
  try {
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
              ...params,
            ],
          },
          parameters: {
            incremental_output: true,
          },
        }),
      },
    );
    console.log(data, "data is requestQwen");
    return data;
  } catch (e) {
    console.log(e);
  }
}
