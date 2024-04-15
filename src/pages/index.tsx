import { ProChat, ProChatInstance } from "@ant-design/pro-chat";
import { useModel, useLocation } from "umi";
import { useRef, useEffect, useState } from "react";
import { Button, Popup, Radio } from "react-vant";
import { Exchange } from "@react-vant/icons";

import { multiChatParams, multipleChatRequest } from "../util/request";
import { requestQwen } from "@/util/requestQWen";
import { createHistoryRequest } from "./api";

export default function HomePage() {
  const { user, setUser } = useModel("userModel");
  const [isShowPopup, setShowPopup] = useState(false);
  // 大模型工具 spark gemini
  const [modelName, setModelName] = useState("aliQwen");
  const proChatRef = useRef<ProChatInstance>();
  const location = useLocation();

  useEffect(() => {
    if (proChatRef) {
      proChatRef.current?.sendMessage(location.state?.title);
    }
  }, [proChatRef]);

  const historyInfo = useRef("");
  const requestLLm = async (
    messages: Array<{ content: string; [x: string]: string }>,
  ) => {
    // 获取历史消息和本次消息
    const multiChatContent = (messages || []).reduce(
      (pre: multiChatParams, cur, index) => {
        const { content, role } = cur;

        if (index === messages.length - 1) {
          // 当前消息
          pre.currentParts = content;
          if (messages.length > 1) {
          } else {
            // createHistoryRequest({
            //   userId: user!.id,
            //   title: content,
            //   contents: [],
            // }).then((res: any) => {
            //   historyInfo.current = res.id;
            // });
          }
        } else {
          // 历史消息
          pre.history.push({
            role: role === "user" ? "user" : "model",
            parts: content,
          });
        }
        return pre;
      },
      {
        history: [],
        currentParts: "",
      },
    );

    try {
      let res: any = await (modelName === "aliQwen"
        ? requestQwen(messages)
        : multipleChatRequest(multiChatContent));

      let readableStream = null;
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      if (modelName !== "aliQwen") {
        readableStream = new ReadableStream({
          async start(controller) {
            for await (const chunk of res) {
              try {
                const chunkText = chunk.text();
                controller.enqueue(encoder.encode(chunkText));
              } catch (err) {
                console.error("读取流中的数据时发生错误", err);
                controller.error(err);
              }
            }
            controller.close();
          },
        });
      } else {
        const reader = res.body.getReader();
        // 通义千问
        readableStream = new ReadableStream(
          {
            async start(controller) {
              function push() {
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    const message = chunk.replace(
                      /id:[0-9]*\nevent:result\n:HTTP_STATUS\/200\ndata:/,
                      "",
                    );
                    console.log(message, "message");
                    const parsed = JSON.parse(message);
                    controller.enqueue(encoder.encode(parsed.output.text));
                    push();
                  })
                  .catch((err) => {
                    console.error("读取流中的数据时发生错误", err);
                    controller.error(err);
                  });
              }
              push();
            },
          },
          {
            highWaterMark: 1,
          },
        );
      }

      return new Response(readableStream);
    } catch (e) {
      console.warn(e);
      return new Response("呜呜呜，出错了，请稍后再试~~");
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const toggleLLm = (val) => {
    setModelName(val);
    // 清空当前内容
    proChatRef.current?.clearMessage();
  };

  return (
    <>
      {/* 悬浮按钮 切换大模型 */}
      <div className="fixed right-0 top-[50%] translate-y-[-50%]">
        <Button
          size="small"
          icon={<Exchange />}
          type="primary"
          onClick={handleOpenPopup}
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
          onChange={(val) => toggleLLm(val)}
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
          onClick={() => setShowPopup(false)}
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
