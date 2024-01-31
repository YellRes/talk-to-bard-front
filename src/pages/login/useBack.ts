import { useState, useEffect } from "react";
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

  /**
   * 添加路由记录
   * */
  function addHistoryStack(currentHistory: THistory) {
    historyStack.push(currentHistory);
    setHistoryStack([...historyStack]);
  }

  /**
   * 减少路由记录
   * */
  function removeHistoryStack() {
    historyStack.pop();
    setHistoryStack([...historyStack]);
  }

  useEffect(() => {
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
    addStopHistory();
    window.addEventListener("popstate", (event) => {
      if (historyStack.length > 1) {
        return Dialog.confirm({
          content: "是否离开当前页面",
          onConfirm: () => {
            // history.go(-2)
            removeHistoryStack();
          },
          onCancel: () => {
            addStopHistory();
          },
        });
      }
      history.go(-2);
      removeHistoryStack();
      return;
    });
  }, []);

  return {
    historyStack,
    addHistoryStack,
    removeHistoryStack,
  };
}
