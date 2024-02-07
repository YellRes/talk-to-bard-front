import { Form, Button, Input } from "antd-mobile";
import {
  PasswordInput,
  Input as VantInput,
  Button as VantButton,
  Cell,
} from "react-vant";
import { useState } from "react";
import { useModel, history } from "umi";
import { useEventTarget, useLocalStorageState } from "ahooks";

import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import useSendEmailCode from "./hooks/useSendEmailCode";
import useBack, { HISTORY_CONST, THistory } from "./hooks/useBack";
import { verifyEmailCodeRequest, registerRequest } from "./api";

type TBaseProps = {
  toNext: (nextHistory: THistory) => void;
};

// 邮箱注册组件
function RegisterWithEmail(props: TBaseProps) {
  const { toNext } = props;
  const { user, setUser } = useModel("userModel");
  const { countDown, btnState, value, onChangeInAntd, reset, submitEmail } =
    useSendEmailCode(() => {
      setUser({
        ...user,
        email: value!,
      });
      toNext(HISTORY_CONST[1]);
    });

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
            onClick={submitEmail}
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
  const { user } = useModel("userModel");
  const { toNext } = props;

  const handleToNext = async (val: string) => {
    try {
      await verifyEmailCodeRequest(user.email, val);
      toNext(HISTORY_CONST[2]);
    } catch (e) {}
  };
  return (
    <>
      <h1 className="h1-primary">输入状态码</h1>
      <PasswordInput length={6} onSubmit={handleToNext} />
    </>
  );
}

// 密码输入
function EnterPassword(props: TBaseProps) {
  const { toNext } = props;
  const [passwordVal, { onChange, ...changeAndReset }] = useEventTargetInAntd({
    initialValue: "",
  });
  const [
    confirmPasswordVal,
    { onChange: onConfirmPasswordChange, ...changeAndResetConfirmPasswordVal },
  ] = useEventTargetInAntd({ initialValue: "" });
  const [_, setLocalToken] = useLocalStorageState("token");
  const { user, setUser } = useModel("userModel");

  const completeRegistration = async () => {
    try {
      let createdUser = await registerRequest(user.email, passwordVal!);
      setLocalToken(createdUser.token);
      setUser({
        ...createdUser,
      });
      history.push("/user");
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <h1 className="h1-primary">输入密码</h1>
      <Cell>
        <VantInput
          placeholder="请输入密码"
          type="password"
          value={passwordVal}
          onChange={changeAndReset.onChangeInAntd}
          {...changeAndReset}
        />
      </Cell>

      <Cell>
        <VantInput
          placeholder="再次输入密码"
          type="password"
          value={confirmPasswordVal}
          onChange={changeAndResetConfirmPasswordVal.onChangeInAntd}
          {...changeAndResetConfirmPasswordVal}
        />
      </Cell>

      <Cell>
        <VantButton type="primary" block round onClick={completeRegistration}>
          完成注册
        </VantButton>
      </Cell>
    </>
  );
}

export default function Register() {
  const { historyStack, addHistoryStack, removeHistoryStack } = useBack(
    HISTORY_CONST[0],
  );

  let currentComponent = null;

  let registerWidthEmail = RegisterWithEmail({ toNext: addHistoryStack });
  let confirmVerificationCode = ConfirmVerificationCode({
    toNext: addHistoryStack,
  });
  let enterPassword = EnterPassword({ toNext: addHistoryStack });

  switch (historyStack[historyStack.length - 1]) {
    case HISTORY_CONST[0]:
      currentComponent = registerWidthEmail;
      break;
    case HISTORY_CONST[1]:
      currentComponent = confirmVerificationCode;
      break;
    case HISTORY_CONST[2]:
      currentComponent = enterPassword;
      break;
    default:
      currentComponent = registerWidthEmail;
      break;
  }
  return <>{currentComponent}</>;
}
