import { Form, Button, Input } from "antd-mobile";
import useSendEmailCode from "./hooks/useSendEmailCode";
import { getMailVerificationCodeRequest, verifyEmailCodeRequest } from "./api";
import useBack, { HISTORY_CONST, THistory } from "./hooks/useBack";
import { useState } from "react";

type TBaseProps = {
  toNext: (nextHistory: THistory) => void;
};

// 邮箱注册组件
function RegisterWithEmail(props: TBaseProps) {
  const { countDown, btnState, value, onChangeInAntd, reset, submitEmail } =
    useSendEmailCode();

  const { toNext } = props;
  const handleSubmitEmail = async () => {
    submitEmail();
  };

  return (
    <>
      <h1 className="h1-primary">邮箱注册</h1>
      <Form
        layout="vertical"
        footer={
          <Button
            block
            type="submit"
            color="primary"
            onClick={handleSubmitEmail}
            loading={btnState.isBtnLoading}
            disabled={btnState.isBtnDisabled}
          >
            {btnState.isBtnDisabled
              ? `请在${Math.round(countDown / 1000)}s后重试`
              : "提交"}
          </Button>
        }
      >
        <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
          <Input
            value={value}
            onChange={onChangeInAntd}
            onClear={reset}
            placeholder="请输入邮箱"
            clearable
          />
        </Form.Item>
      </Form>
    </>
  );
}

// 验证码输入
function ConfirmVerificationCode(props: TBaseProps) {
  const { toNext } = props;
  const handleToNext = () => toNext(HISTORY_CONST[2]);

  return (
    <>
      <h1 className="h1-primary">输入状态码</h1>
      <Button block onClick={handleToNext}>
        提交
      </Button>
    </>
  );
}

// 密码输入
function EnterPassword(props: TBaseProps) {
  const { toNext } = props;

  return (
    <>
      <h1 className="h1-primary">输入密码</h1>
      <Button block>提交</Button>
    </>
  );
}

export default function Register() {
  const { historyStack, addHistoryStack, removeHistoryStack } = useBack(
    HISTORY_CONST[0],
  );

  const renderComponentByCurrentHistory = () => {
    switch (historyStack[historyStack.length - 1]) {
      case HISTORY_CONST[0]:
        return RegisterWithEmail({ toNext: addHistoryStack });
      case HISTORY_CONST[1]:
        return ConfirmVerificationCode({ toNext: addHistoryStack });
      case HISTORY_CONST[2]:
        return EnterPassword({ toNext: addHistoryStack });
      default:
        return null;
    }
  };

  return <>{renderComponentByCurrentHistory()}</>;
}
