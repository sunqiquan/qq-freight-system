/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * utility functions encapsulated
 */

import { Menu } from "@/types/api";

export const getMenuPath = (list: Menu.MenuItem[]): string[] => {
  return list.reduce((result: string[], item: Menu.MenuItem) => {
    return result.concat(
      Array.isArray(item.children) && !item.buttons
        ? getMenuPath(item.children)
        : item.path + ""
    );
  }, []);
};

export const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(num);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("zh-CN").format(num);
};

export const formatPercent = (num: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatDateTime = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(date)
    .replace(/\//g, "-");
};

export const formatDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\//g, "-");
};

export const formatTime = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const formatMonth = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
  }).format(date);
};

export const formatDay = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
  }).format(date);
};

export const formatYear = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
  }).format(date);
};

export const formatWeek = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
    day: "numeric",
  }).format(date);
};

export const formatState = (state: number) => {
  if (state === 1) return "Employed";
  if (state === 2) return "Trial Period";
  if (state === 3) return "Resign";
};

export const findTreeNode = (
  tree: Menu.MenuItem[],
  pathName: string,
  path: string[]
): string[] => {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data.menuName);
    if (data.path === pathName) return path;
    if (data.children?.length) {
      const list = findTreeNode(data.children, pathName, path);
      if (list?.length) return list;
    }
    path.pop();
  }
  return [];
};

export const searchRoute: any = (path: string, routes: any = []) => {
  for (const item of routes) {
    if (item.path === path) return item;
    if (item.children) {
      const result = searchRoute(path, item.children);
      if (result) return result;
    }
  }
  return "";
};
