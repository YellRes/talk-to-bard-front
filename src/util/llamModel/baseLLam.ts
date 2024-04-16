import { ChatMessage } from "@ant-design/pro-chat";

export default class BaseLLam<T, P, R> {
  model: T;
  constructor(model: T) {
    this.model = model;
  }

  getRequestParams(params: ChatMessage[]) {}

  async request(params: ChatMessage[]): Promise<Response> {
    return new Response("");
  }

  handleResponse(response: R): Response {
    return new Response("");
  }
}
