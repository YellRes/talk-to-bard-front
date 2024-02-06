import { useRequest } from "ahooks";
import { useState } from "react";
import type { IUser } from "@/types/user";
// import { getUser } from '@/services/user';

export default function UserModel() {
  const [user, setUser] = useState<IUser & Record<string, any>>({
    email: "",
  });

  // const changeUser = useCallback(() => setCounter((c) => c + 1), []);
  return {
    user,
    setUser,
  };
}
