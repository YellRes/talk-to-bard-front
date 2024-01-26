import { Badge, TabBar } from "antd-mobile";
import { AppOutline, UserOutline } from "antd-mobile-icons";
import { Outlet, useLocation, history } from "umi";
import styles from "./index.less";

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;

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
        <TabBar safeArea onChange={(val) => history.push(val)}>
          {allTabs.map((tab) => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
}
