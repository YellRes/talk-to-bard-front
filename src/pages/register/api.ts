import { getRequest, postRequest } from "@/core/request";
import type { IUser } from "@/types/user";

// 获取邮箱验证码
export function getMailVerificationCodeRequest(email: string) {
  return getRequest("/api/user/sendEmailCode", {
    params: {
      email,
    },
    otherAxiosConfig: {
      customNotify: true,
    },
  });
}

// 验证验证码
export function verifyEmailCodeRequest(email: string, code: string) {
  return getRequest("/api/user/verifyEmailCode", {
    params: {
      email,
      code,
    },
  });
}

// 注册
export function registerRequest(email: string, password: string) {
  return postRequest<
    Partial<IUser> & { password: string },
    IUser & { token: string }
  >("/api/user/createUser", {
    otherAxiosConfig: {
      data: {
        email,
        password,
      },
    },
  });
}

// 登录
export function loginRequest(email: string, password: string) {
  return postRequest("/api/user/login", {
    params: {
      email,
      password,
    },
  });
}
