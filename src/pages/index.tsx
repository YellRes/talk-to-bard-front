import { ProChat, ProChatInstance } from "@ant-design/pro-chat";
import { useModel, useLocation } from "umi";
import { useRef, useEffect } from "react";

import { multiChatParams, multipleChatRequest } from "../util/request";
import { createHistoryRequest } from "./api";

export default function HomePage() {
  const { user, setUser } = useModel("userModel");
  const proChatRef = useRef<ProChatInstance>();
  const location = useLocation();

  useEffect(() => {
    if (proChatRef) {
      proChatRef.current?.sendMessage(location.state?.title);
    }
  }, [proChatRef]);

  const historyInfo = useRef("");
  const requestBard = async (
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
            createHistoryRequest({
              userId: user!.id,
              title: content,
              contents: [],
            }).then((res: any) => {
              historyInfo.current = res.id;
            });
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
      let res = await multipleChatRequest(multiChatContent);
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
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
      return new Response(readableStream);
    } catch (e) {
      console.warn(e);
      return new Response("呜呜呜，出错了，请稍后再试~~");
    }
  };

  return (
    <ProChat
      chatRef={proChatRef}
      helloMessage={"新的一天，有什么我可以帮你的~~"}
      displayMode={"docs"}
      request={requestBard}
    />
  );
}
