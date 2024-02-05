import { getRequest, postRequest } from "@/core/request";

// 获取邮箱验证码
export function getMailVerificationCodeRequest(email: string) {
  return getRequest("/api/user/sendEmailCode", {
    params: {
      email,
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
