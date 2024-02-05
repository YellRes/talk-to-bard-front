import { useState, useEffect, useRef } from "react";
import { Dialog } from "antd-mobile";

export const HISTORY_CONST = [
  "REGISTER_WITH_EMAIL",
  "CONFIRM_VERIFICATION_CODE",
  "ENTER_PASSWORD",
] as const;
export type THistory = (typeof HISTORY_CONST)[number];

export default function useBack(initialVal: THistory) {
  const [historyStack, setHistoryStack] = useState<Array<THistory>>([
    initialVal,
  ]);
  const historyStackRef = useRef<Array<THistory>>([]);

  /**
   * 添加路由记录
   * */
  function addHistoryStack(currentHistory: THistory) {
    historyStack.push(currentHistory);
    historyStackRef.current = historyStack;
    setHistoryStack([...historyStackRef.current]);
  }

  /**
   * 减少路由记录
   * */
  function removeHistoryStack() {
    historyStackRef.current = historyStackRef.current.slice(0, -1);
    setHistoryStack([...historyStackRef.current]);
  }

  /**
   * 控制路由返回
   */
  function addStopHistory() {
    history.pushState(
      {
        id: "stopBack",
      },
      "",
      window.location.href,
    );
  }

  function handlePopState(e: PopStateEvent) {
    if (historyStack.length > 1) {
      return Dialog.confirm({
        content: "是否离开当前页面",
        onConfirm: () => {
          removeHistoryStack();
        },
        onCancel: () => {
          addStopHistory();
        },
      });
    }
    history.go(-2);
    return;
  }

  useEffect(() => {
    addStopHistory();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [historyStack]);

  return {
    historyStack,
    addHistoryStack,
    removeHistoryStack,
  };
}
