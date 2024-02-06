import { useSetState, useLocalStorageState, useCountDown } from "ahooks";
import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import { getMailVerificationCodeRequest } from "../api";
import { useEffect, useRef } from "react";

// 邮箱注册
export default function useSendEmailCode(handleNext: any) {
  // 表单验证
  const [value, { onChangeInAntd, reset }] = useEventTargetInAntd({
    initialValue: "",
    transformer: (value) => value.trim(),
  });
  const [btnState, setBtnState] = useSetState({
    isBtnLoading: false,
    isBtnDisabled: false,
    targetDate: Date.now(),
  });
  // 倒计时
  const [countDown] = useCountDown({
    targetDate: btnState.targetDate,
    onEnd: () =>
      setBtnState({
        isBtnDisabled: false,
      }),
  });
  const [remainTime, setRemainTime] = useLocalStorageState("timerId");
  const [lastTime, setLastTime] = useLocalStorageState("lastTime");

  // 初始化时候根据上次倒计时配置按钮状态
  useEffect(() => {
    if (!(Date.now() - Number(lastTime) > Number(remainTime))) {
      console.log(
        Math.floor((Number(remainTime) - Date.now() + Number(lastTime)) / 1000),
        "Math.floor((Number(remainTime) - Date.now() + Number(lastTime)) / 1000)",
      );
      setBtnState({
        isBtnDisabled: true,
        targetDate:
          Date.now() + Number(remainTime) - Date.now() + Number(lastTime),
      });
    }
  }, []);

  // 记录上次的倒计时剩余时间
  useEffect(() => {
    setRemainTime(countDown);
    setLastTime(Date.now());
  }, [countDown]);

  const submitEmail = async () => {
    try {
      setBtnState({
        isBtnLoading: true,
      });
      await getMailVerificationCodeRequest(value!);
      setBtnState({
        isBtnDisabled: true,
        targetDate: Date.now() + 60 * 1000,
      });
      handleNext();
    } catch (e) {
      console.warn(e);
    }

    setBtnState({ isBtnLoading: false });
  };

  return {
    countDown,
    btnState,
    value,
    onChangeInAntd,
    reset,
    submitEmail,
  };
}
