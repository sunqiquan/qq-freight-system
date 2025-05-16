import { Navigate } from "react-router-dom";
import Login from "@/views/login";
import UnAuthorize from "@/views/UnAuthorize";
import NotFound from "@/views/NotFound";
import Layout from "@/layout";
import AuthLoader from "./AuthLoader";
import React from "react";
import Workbench from "@/views/workbench";
import { lazyLoad } from "./LazyLoad";

const routes = [
  {
    id: "layout",
    element: <Layout />,
    loader: AuthLoader,
    children: [
      {
        path: "/welcome",
        element: <Workbench />,
      },
      {
        path: "/workbench",
        element: lazyLoad(React.lazy(() => import("@/views/workbench"))),
      },
      {
        path: "/userlist",
        element: lazyLoad(React.lazy(() => import("@/views/system/user"))),
      },
      {
        path: "/deptlist",
        element: lazyLoad(React.lazy(() => import("@/views/system/dept"))),
      },
      {
        path: "/menulist",
        element: lazyLoad(React.lazy(() => import("@/views/system/menu"))),
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/welcome" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/403",
    element: <UnAuthorize />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "/*",
    element: <Navigate to="/404" />,
  },
];

export default routes;
