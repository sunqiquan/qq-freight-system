import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import AntdComp from "@/utils/AntdComp";
import routs from "@/router";
import "@/App.less";
import { useStore } from "./store";

const App = () => {
  const isDark = useStore((state) => state.isDark);
  const Router = createBrowserRouter(routs);
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#ed6c00" },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AntdComp />
        <RouterProvider router={Router} />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
