/* eslint-disable react-hooks/exhaustive-deps */
import { IAuthLoader } from "@/router/AuthLoader";
import { findTreeNode } from "@/utils";
import { Breadcrumb } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";

export default function BreadCrumb() {
  const { pathname } = useLocation();
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([]);

  // judgment authority
  const data = useRouteLoaderData("layout") as IAuthLoader;

  useEffect(() => {
    const list = findTreeNode(data.menuList, pathname, []);
    setBreadList([<a href="/welcome">Home</a>, ...list]);
  }, [pathname]);
  return (
    <Breadcrumb
      items={breadList.map((item) => ({ title: item }))}
      style={{ marginLeft: 10 }}
    />
  );
}
