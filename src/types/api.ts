/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
// define interface type

export interface Result<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface ResultData<T = any> {
  list: T[];
  page: {
    current: number;
    pageSize: number;
    total: number | 0;
  };
}

// workbench data
export namespace Workbench {
  export interface ReportData {
    driverCount: number;
    totalMoney: number;
    orderCount: number;
    cityNum: number;
  }

  export interface LineChartData {
    label: string[];
    order: number[];
    money: number[];
  }

  export interface PieChartData {
    value: number;
    name: string;
  }

  export interface RadarChartData {
    indicator: Array<{ name: string; max: number }>;
    value: number[];
  }
}

export interface PageParams {
  current: number;
  pageSize: number;
}

export namespace LoginType {
  export interface params {
    userName: string;
    userPwd: string;
  }
}

// user manage
export namespace User {
  export interface Params extends PageParams {
    userId?: number;
    userName?: string;
    state?: number;
  }

  export interface SearchParams {
    userId?: number;
    userName?: string;
    state?: number;
  }

  export interface UserItem {
    _id: string;
    userId: number;
    userName: string;
    userEmail: string;
    deptId: string;
    state: number;
    mobile: string;
    job: string;
    role: number;
    roleList: string;
    createTime: string;
    deptName: string;
    userImg: string;
  }

  export interface CreateParams {
    userName: string;
    userEmail: string;
    deptId: string;
    state?: number;
    mobile?: string;
    job?: string;
    roleList: string[];
    userImg?: string;
  }

  export interface EditParams extends CreateParams {
    userId: number;
  }
}

export namespace Dept {
  export interface Params {
    deptName?: string;
  }

  export interface CreateParams {
    deptName: string;
    parentId?: string;
    userName: string;
  }

  export interface EditParams extends CreateParams {
    _id: string;
  }

  export interface DelParams {
    _id: string;
  }

  export interface DeptItem {
    _id: string;
    createTime: string;
    updateTime: string;
    deptName: string;
    parentId: string;
    userName: string;
    children: DeptItem[];
  }
}

// menu manage
export namespace Menu {
  export interface Params {
    menuName: string;
    menuState: number;
  }

  export interface CreateParams {
    menuName: string;
    icon?: string;
    menuType: number; // 1: menu 2：button 3：page
    menuState: number; // 1：normal 2：disabled
    menuCode?: string; // button auth code
    parentId?: string; // Parent ID
    path?: string; // navigation path
    component?: string; // component path
  }

  export interface MenuItem extends CreateParams {
    _id: string;
    createTime: string;
    buttons?: MenuItem[];
    children?: MenuItem[];
  }

  export interface EditParams extends CreateParams {
    _id?: string;
  }

  export interface DelParams {
    _id: string;
  }
}
