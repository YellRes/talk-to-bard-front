import { postRequest } from "@/core/request";
import type { IUser } from "@/types/user";

export function editUserInfoRequest(
  userInfo: Partial<IUser> & Record<string, any>,
) {
  return postRequest<any, IUser & Record<string, any>>("/api/user/updateUser", {
    otherAxiosConfig: {
      data: {
        ...userInfo,
      },
    },
  });
}
