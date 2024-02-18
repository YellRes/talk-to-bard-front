import { Cell, Input, Form, Button, Loading } from "react-vant";
import { useState } from "react";
import { useModel, history } from "umi";
import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import { ReactComponent as SvgAI } from "@/assets/svg/ai.svg";

import { loginRequest } from "./api";

// 登录页面
export default function Login() {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [emailVal, { onChangeInAntd: onChangeEmail, reset: resetEmail }] =
    useEventTargetInAntd({
      initialValue: "",
    });
  const [
    passwordVal,
    { onChangeInAntd: onChangePassword, reset: resetPassword },
  ] = useEventTargetInAntd({
    initialValue: "",
  });
  const { user, setUser } = useModel("userModel");

  async function onFinish() {
    setLoading(true);
    let loginInfo = await loginRequest({
      email: emailVal!,
      password: passwordVal!,
    });
    setUser(loginInfo);
    history.push("/user");

    setLoading(false);
  }

  return (
    <>
      <SvgAI className="mx-auto" />
      <h3 className="h1-primary">登录</h3>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        footer={
          <div style={{ margin: "16px 16px 0" }}>
            <Button
              round
              nativeType="submit"
              type="primary"
              block
              loading={isLoading}
            >
              登录
            </Button>
          </div>
        }
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input
            value={emailVal}
            onChange={onChangeEmail}
            onClear={resetEmail}
            placeholder="请输入邮箱"
            suffix={isLoading && <Loading size="20" />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input
            placeholder="请输入密码"
            value={passwordVal}
            onChange={onChangePassword}
            onClear={resetPassword}
            type="password"
          />
        </Form.Item>
      </Form>
    </>
  );
}
