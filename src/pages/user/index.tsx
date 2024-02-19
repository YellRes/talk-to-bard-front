// node_modules库
import React, { useState } from "react";
import { history, useModel } from "umi";
import classnames from "classnames";
import { Button, Tabs, Card, List } from "antd-mobile";

import styles from "./index.less";
import type { IUser } from "@/types/user.d.ts";

export default function UserPage() {
  const [userInfo, setUserInfo] = useState<Partial<IUser>>({});
  const { user, setUser } = useModel("userModel");

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

        <List header="历史记录">
          {
            // [].map(historyInfo => (
            //   <List.Item key={ } prefix={ } description={ }>
            //     { historyInfo.content }
            //   </List.Item>
            // ))
          }
        </List>
      </div>
    </div>
  );
}
