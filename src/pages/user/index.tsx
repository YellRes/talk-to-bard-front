// node_modules库
import classnames from "classnames";
import React, { useState } from "react";
import { Button, Tabs, Card, List } from "antd-mobile";

// import { ReactComponent as AiSvg } from '@/assets/svg/ai.svg'
import styles from "./index.less";
import type { IUser } from "@/types/user.d.ts";

// const TABS = ['历史记录']

export default function UserPage() {
  const [userInfo, setUserInfo] = useState<Partial<IUser>>({});

  return (
    <div className={classnames(styles.user, ["bg-[#f0f2f5]", "flex-col"])}>
      <div
        className={classnames(styles.top_userInfo, ["bg-[#fff]", "mt-[50px]"])}
      >
        <div className="relative">
          <img
            src={
              userInfo.avatarUrl
                ? userInfo.avatarUrl
                : require("../../assets/yay.jpg")
            }
            className="w-[100px] h-[100px] rounded-full mx-auto mt-[-30px]"
          />
        </div>
        <div className="text-2xl font-bold mb-[16px] text-center">
          {userInfo.name || "yellres"}
        </div>

        <div className="text-center mb-[16px]">
          <Button size="mini" color="primary">
            编辑信息
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

        <Card title="历史记录"></Card>
      </div>
      {/* <AiSvg /> */}
    </div>
  );
}
