import { postRequest } from "@/core/request";

interface ICreateHistory {
  userId: number;
  title: string;
  contents: Array<{
    role: "user" | "model";
    parts: string;
  }>;
}

// 添加历史记录
export function createHistoryRequest(params: ICreateHistory) {
  return postRequest("/api/history/createHistory", {
    otherAxiosConfig: {
      data: params,
    },
  });
}
