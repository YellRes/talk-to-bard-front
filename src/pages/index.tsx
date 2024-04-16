import { ProChat, ProChatInstance, ChatMessage } from "@ant-design/pro-chat";
import { useModel, useLocation } from "umi";
import { useRef, useEffect, useState, useMemo } from "react";
import { Button, Popup, Radio } from "react-vant";
import { Exchange } from "@react-vant/icons";

import { createHistoryRequest } from "./api";
import { Gemini, Qwen } from "@/util/llamModel";

export default function HomePage() {
  const { user, setUser } = useModel("userModel");
  const [isShowPopup, setShowPopup] = useState(false);
  // 大模型工具 qwen gemini
  const gemini = useRef(new Gemini({ model: "gemini-pro" }));
  const qwen = useRef(new Qwen({}));

  const [modelName, setModelName] = useState("aliQwen");
  const proChatRef = useRef<ProChatInstance>();
  const location = useLocation();

  useEffect(() => {
    if (proChatRef) {
      proChatRef.current?.sendMessage(location.state?.title);
    }
  }, [proChatRef]);

  // 当前的大模型工具
  const currentModel = useMemo(() => {
    if (modelName === "aliQwen") {
      return qwen.current;
    } else {
      return gemini.current;
    }
  }, [modelName]);

  const historyInfo = useRef("");
  const requestLLm = async (messages: ChatMessage[]) => {
    try {
      // 创建对话记录
      if (messages.length === 1) {
        createHistoryRequest({
          userId: user!.id,
          title: messages[0].content as string,
          contents: [],
        });
      }
      return await currentModel.request(messages);
    } catch (e) {
      console.warn(e);
      return new Response("呜呜呜，出错了，请稍后再试~~");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    proChatRef.current?.clearMessage();
  };

  return (
    <>
      {/* 悬浮按钮 切换大模型 */}
      <div className="fixed right-0 top-[50%] translate-y-[-50%] z-[999]">
        <Button
          size="small"
          icon={<Exchange />}
          type="primary"
          onClick={() => setShowPopup(true)}
        />
      </div>

      <Popup
        className="p-2 pb-8"
        visible={isShowPopup}
        position="bottom"
        onClose={() => setShowPopup(false)}
      >
        <h3>选择对应的大模型</h3>
        <Radio.Group
          direction="vertical"
          value={modelName}
          onChange={(val) => setModelName(val)}
        >
          <Radio name={"aliQwen"}>通义千问(阿里)</Radio>
          <Radio name={"gemini"}>google gemini(需要梯子)</Radio>
        </Radio.Group>

        <Button
          className="mt-4"
          size="small"
          type="primary"
          block
          round
          onClick={handleClosePopup}
        >
          确定
        </Button>
      </Popup>
      <ProChat
        chatRef={proChatRef}
        helloMessage={"新的一天，有什么我可以帮你的~~"}
        displayMode={"docs"}
        request={requestLLm}
      />
    </>
  );
}
