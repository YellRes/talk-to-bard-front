import { Badge, TabBar } from "antd-mobile";
import { AppOutline, UserOutline } from "antd-mobile-icons";
import { Outlet, useLocation, history, connect } from "umi";
import { useState } from "react";
import styles from "./index.less";

function Layout(props: any) {
  const location = useLocation();

  const { pathname } = location;
  const [activeKey, setActiveKey] = useState(pathname || "/index");

  const allTabName = ["/index", "/user"];
  const allTabs = [
    {
      key: "/index",
      title: "首页",
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: "/user",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  if (!allTabName.includes(pathname)) {
    return <Outlet />;
  }

  return (
    <div className={styles.navs}>
      <div className={styles.body_content}>
        <Outlet />
      </div>
      <div className={styles.tabbar}>
        <TabBar
          safeArea
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
            history.push(val);
          }}
        >
          {allTabs.map((tab) => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
}

export default connect((modelInfo: any) => modelInfo.userInfo)(Layout);
