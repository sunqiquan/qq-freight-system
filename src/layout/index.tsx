/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Layout, Watermark } from "antd";
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
import SideMenu from "@/components/SideMenu";
import {
  Navigate,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import styles from "./index.module.less";
import api from "@/api";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { IAuthLoader } from "@/router/AuthLoader";
import { searchRoute } from "@/utils";
import routes from "@/router";
import TabsFC from "@/components/Tabs";

const { Content, Sider } = Layout;

const LayoutRC: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    getUserInfo();
  }, []);

  const { collapsed, userInfo, updateUserInfo } = useStore(
    useShallow((state) => ({
      collapsed: state.collapsed,
      userInfo: state.userInfo,
      updateUserInfo: state.updateUserInfo,
    }))
  );

  // determine routing permissions
  const data = useRouteLoaderData("layout") as IAuthLoader;
  const route = searchRoute(pathname, routes);
  if (route && route.meta?.auth === false) {
    console.log("has authority");
  } else {
    const staticPath = ["/welcome", "/403", "/404"];
    if (
      !data.menuPathList.includes(pathname) &&
      !staticPath.includes(pathname)
    ) {
      return <Navigate to="/403" />;
    }
  }

  const getUserInfo = async () => {
    const user = await api.getUserInfo();
    updateUserInfo(user);
  };

  return (
    <Watermark content="Freight System">
      {userInfo._id ? (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsed={collapsed}>
            <SideMenu />
          </Sider>
          <Layout>
            <NavHeader />
            <TabsFC />
            <Content className={styles.content}>
              <div className={styles.wrapper}>
                <Outlet />
              </div>
              <NavFooter />
            </Content>
          </Layout>
        </Layout>
      ) : null}
    </Watermark>
  );
};

export default LayoutRC;
