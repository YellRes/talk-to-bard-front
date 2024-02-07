import { Cell, Input, Form, Button, Loading } from "react-vant";
import { useState } from "react";
import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import { ReactComponent as SvgAI } from "@/assets/svg/ai.svg";

// 登录页面
export default function Login() {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <SvgAI className="mx-auto" />
      <h3 className="h1-primary">登录</h3>
      <Form
        layout="vertical"
        form={form}
        footer={
          <div style={{ margin: "16px 16px 0" }}>
            <Button round nativeType="submit" type="primary" block>
              登录
            </Button>
          </div>
        }
      >
        <Form.Item name="email" label="邮箱">
          <Input
            placeholder="请输入邮箱"
            suffix={isLoading && <Loading size="20" />}
          />
        </Form.Item>

        <Form.Item name="password" label="密码">
          <Input placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </>
  );
}
