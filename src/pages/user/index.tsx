import React, { useEffect, useState } from "react";
import { history, useModel } from "umi";
import classnames from "classnames";
import { Button, Tabs, Card, List } from "antd-mobile";
import { Cell } from "react-vant";

import styles from "./index.less";
import type { IUser } from "@/types/user.d.ts";
import { getAllHistoryRequest } from "../api";

export default function UserPage() {
  const [userInfo, setUserInfo] = useState<Partial<IUser>>({});
  const { user, setUser } = useModel("userModel");
  const [chatHistory, setHistory] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    (async function () {
      let res = await getAllHistoryRequest(user!.id);
      setHistory(res || []);
    })();
  }, []);

  const jumpToIndex = ({ title }: any) => {
    history.push(
      {
        pathname: "/index",
      },
      {
        title,
      },
    );
  };

  return (
    <div className={classnames(styles.user, ["bg-[#f0f2f5]", "flex-col"])}>
      <div
        className={classnames(styles.top_userInfo, ["bg-[#fff]", "mt-[50px]"])}
      >
        <div className="relative">
          <img
            src={require("../../assets/yay.jpg")}
            className="w-[100px] h-[100px] rounded-full mx-auto mt-[-30px]"
          />
        </div>
        <div className="text-2xl font-bold mb-[16px] text-center">
          {user?.token ? user.name : "未登录"}
        </div>

        <div className="text-center mb-[16px]">
          <Button
            size="mini"
            color="primary"
            onClick={() => history.push(user?.token ? "/edit" : "/login")}
          >
            {user?.token ? "编辑信息" : "立即登录"}
          </Button>
        </div>
      </div>

      <div className={classnames(styles.bottom_history, ["bg-[#fff]", "mt-4"])}>
        {/* <Tabs>
          {
            TABS.map((item, index) => (
              <Tabs.Tab
                key={index}
                title={item}
              >
              { item }
              </Tabs.Tab>
            ))
          }
        </Tabs> */}

        <div className="h1-primary text-left">历史记录</div>
        <Cell.Group>
          {chatHistory.length
            ? chatHistory.map((historyInfo) => (
                <Cell
                  key={historyInfo.title}
                  isLink
                  onClick={() => jumpToIndex({ title: historyInfo.title })}
                >
                  <p className="truncate">{historyInfo.title}</p>
                </Cell>
              ))
            : ""}
        </Cell.Group>
      </div>
    </div>
  );
}
