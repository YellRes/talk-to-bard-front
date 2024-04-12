import { history } from "umi";

export function handleAuthExpired() {
  history.push("/login");
}
