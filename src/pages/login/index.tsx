// import { } from ''
import { useState, useRef, useEffect } from "react";
import {
  FloatingPanel,
  Form,
  Button,
  Input,
  Mask,
  FloatingPanelRef,
} from "antd-mobile";
import { useClickAway } from "ahooks";
import styles from "./index.less";

const HEIGHT_MIN = window.innerHeight * 0.4;
const HEIGHT_MAX = window.innerHeight * 0.8;
const anchors = [HEIGHT_MIN, HEIGHT_MAX];

export default function Login() {
  const [isMaskOpen, setMaskOpen] = useState(true);
  const targetRef = useRef<FloatingPanelRef>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    setMaskOpen(false);
    targetRef?.current?.setHeight(HEIGHT_MIN);
  }, outerRef);

  const handleFocus = () => {
    setMaskOpen(true);
    targetRef.current?.setHeight(HEIGHT_MAX);
  };

  // Input是focus状态，且targetRef此时升高的时候。
  // useEffect(() => {})

  return (
    <>
      <img src={require("@/assets/bard-login.png")} alt="" width={"100%"} />

      <div ref={outerRef}>
        <FloatingPanel ref={targetRef} anchors={anchors}>
          <Form
            layout="vertical"
            footer={
              <Button block type="submit" color="primary" size="mini">
                提交
              </Button>
            }
          >
            <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
              <Input placeholder="清输入邮箱" onFocus={handleFocus} clearable />
            </Form.Item>
          </Form>
        </FloatingPanel>
      </div>

      <Mask visible={isMaskOpen} className={styles.login_mask} />
    </>
  );
}
