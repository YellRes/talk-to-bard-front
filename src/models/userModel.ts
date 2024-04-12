import { useLocalStorageState } from "ahooks";
import type { IUser } from "@/types/user";

export default function UserModel() {
  const [cacheUser, setCacheUser] = useLocalStorageState<
    IUser & Record<string, any>
  >("user", {
    defaultValue: {
      email: "",
      id: "",
    },
  });

  return {
    user: cacheUser,
    setUser: (val) => {
      setCacheUser({
        ...cacheUser,
        ...val,
      });
    },
  };
}
