import { useState } from "react";
import { FloatingPanel, Mask } from "antd-mobile";
import styles from "./index.less";
import ConfirmPassword from "./confirmPassword";
import EnterPassword from "./enterPassword";
import Register from "./register";

const HEIGHT_MIN = window.innerHeight * 0.43;
const HEIGHT_MAX = window.innerHeight * 0.7;
const anchors = [HEIGHT_MIN];

export default function Login() {
  const [isMaskOpen, setMaskOpen] = useState(true);

  return (
    <>
      <img
        className="mx-auto"
        src={require("@/assets/chat.png")}
        alt=""
        width={"100%"}
      />

      {/* 邮箱 => 验证码 => 设置密码 */}
      <FloatingPanel className="floatingPanel" anchors={anchors}>
        <Register />
      </FloatingPanel>

      <Mask visible={isMaskOpen} className={styles.login_mask} />
    </>
  );
}
