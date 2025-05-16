import { Menu } from "antd";
import {
  DesktopOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import styles from "./index.module.less";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { useEffect, useState } from "react";

const SideMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDark, collapsed } = useStore(
    useShallow((state) => ({
      isDark: state.isDark,
      collapsed: state.collapsed,
    }))
  );

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key]);
    navigate(key);
  };

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, []);

  const items = [
    {
      key: "/workbench",
      icon: <DesktopOutlined />,
      label: "Workbench",
    },
    {
      key: "system",
      icon: <SettingOutlined />,
      label: "System Manage",
      children: [
        {
          key: "/userlist",
          label: "User Manage",
          icon: <UserOutlined />,
        },
        {
          key: "/deptlist",
          label: "Dept Manage",
          icon: <ProfileOutlined />,
        },
        {
          key: "/menulist",
          label: "Menu Manage",
          icon: <MenuOutlined />,
        },
      ],
    },
  ];

  return (
    <div className={styles.navSide}>
      <div className={styles.logo}>
        <img src="/imgs/logo.png" />
        {collapsed ? " " : <span>Freight System</span>}
      </div>
      <Menu
        selectedKeys={selectedKeys}
        mode="inline"
        theme={isDark ? "light" : "dark"}
        items={items}
        onClick={handleClickMenu}
      />
    </div>
  );
};

export default SideMenu;
