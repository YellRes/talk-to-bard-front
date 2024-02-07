import { useState } from "react";
import type { IUser } from "@/types/user";

export default function UserModel() {
  const [user, setUser] = useState<IUser & Record<string, any>>({
    email: "",
  });

  return {
    user,
    setUser,
  };
}
