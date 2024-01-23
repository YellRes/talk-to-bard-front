import { ProChat } from "@ant-design/pro-chat";

import { multiChatParams, multipleChatRequest } from "../util/request";

export default function HomePage() {
  // const [chatContent] = useState<Array<{text: string}>>([])

  // hooks 函数
  // const { run } = useRequest(() => {
  //   return request(REQUEST_URL!, {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     data: {
  //       contents: [
  //         {
  //           parts: chatContents
  //         }
  //       ]
  //     }
  //   })
  // }, {
  //   manual: true,
  //   onSuccess: (result) => {

  //   }
  // })

  const requestBard = async (
    messages: Array<{ content: string; [x: string]: string }>,
  ) => {
    console.log(messages, "message");
    // 获取历史消息和本次消息
    const multiChatContent = (messages || []).reduce(
      (pre: multiChatParams, cur, index) => {
        const { content, role } = cur;

        if (index === messages.length - 1) {
          // 当前消息
          pre.currentParts = content;
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
      // let res = await request(REQUEST_URL!, {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   data: {
      //     contents: [
      //       {
      //         parts: chatContents
      //       }
      //     ]
      //   }
      // })

      // return res.candidates.map((candidate: any) => {
      //   return candidate.content.parts.map((part: any) => part.text)
      // }).filter(Boolean).join('\n')

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
      helloMessage={"新的一天，有什么有什么我可以帮你的~~"}
      displayMode={"docs"}
      request={requestBard}
    />
  );
}
