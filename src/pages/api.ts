import { getRequest, postRequest } from "@/core/request";

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

// 更新历史记录
export function updateHistoryRequest(params: ICreateHistory & { id: number }) {
  return postRequest<any, any>("/api/history/updateHistory", {
    otherAxiosConfig: {
      data: params,
    },
  });
}

// 获取所有的历史记录
export function getAllHistoryRequest(id: number) {
  return getRequest<any, any>("/api/history/getHistoryByUserId", {
    params: {
      userId: id,
    },
  });
}
