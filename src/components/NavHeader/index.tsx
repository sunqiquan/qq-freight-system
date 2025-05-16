import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Dropdown, Switch } from "antd";
import type { MenuProps } from "antd";
import styles from "@/components/NavHeader/index.module.less";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import storage from "@/utils/storage";
import BreadCrumb from "./BreadCrumb";
import { useEffect } from "react";

const NavHeader = () => {
  const { isDark, updateTheme, collapsed, updateCollapsed, userInfo } =
    useStore(
      useShallow((state) => ({
        isDark: state.isDark,
        updateTheme: state.updateTheme,

        collapsed: state.collapsed,
        updateCollapsed: state.updateCollapsed,

        userInfo: state.userInfo,
      }))
    );

  useEffect(() => {
    handleSwitch(isDark);
  }, []);

  const items: MenuProps["items"] = [
    {
      key: "email",
      label: "email: " + userInfo.userEmail,
    },
    {
      key: "logout",
      label: "logout",
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      storage.remove("token");
      location.href = "/login?callback=" + encodeURIComponent(location.href);
    }
  };

  const handleSwitch = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
    }
    storage.set("isDark", isDark);
    updateTheme(isDark);
  };

  return (
    <div className={styles.nav}>
      <div className={styles.left}>
        <div
          onClick={() => {
            updateCollapsed();
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined style={{ marginRight: "10px" }} />
          ) : (
            <MenuFoldOutlined style={{ marginRight: "10px" }} />
          )}
        </div>
        <BreadCrumb />
      </div>
      <div>
        <Switch
          checked={isDark}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          style={{ marginRight: "10px" }}
          onChange={handleSwitch}
        />
        <Dropdown menu={{ items, onClick }} trigger={["click"]}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavHeader;
