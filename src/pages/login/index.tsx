import { Cell, Input, Form, Button, Loading } from "react-vant";
import { useEffect, useState } from "react";
import { history, connect } from "umi";
import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import { ReactComponent as SvgAI } from "@/assets/svg/ai.svg";

import { loginRequest } from "./api";

// 登录页面
function Login(props: any) {
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

  useEffect(() => {
    props.dispatch({
      type: "userInfo/save",
      payload: {},
    });
  }, []);

  async function onFinish() {
    setLoading(true);
    try {
      let loginInfo = await loginRequest({
        email: emailVal!,
        password: passwordVal!,
      });

      props.dispatch({
        type: "userInfo/save",
        payload: loginInfo,
      });
      history.push("/user");
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }

  function toRegister() {
    history.push("/register");
  }

  return (
    <>
      <div className="text-center">
        <SvgAI className="mx-auto" />
      </div>
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

            <div className="mt-[4px] text-center" onClick={toRegister}>
              没有账号，去注册
            </div>
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

export default connect((model: any) => model.userInfo)(Login);
