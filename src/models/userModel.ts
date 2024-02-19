import { useState, useEffect } from "react";
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
  // const [user, setUser] = useState<IUser & Record<string, any>>({
  //   email: "",
  // });

  // useEffect(() => {
  //   setUser(cacheUser!)
  // }, [cacheUser])

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
