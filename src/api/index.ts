import request from "@/utils/request";
import {
  Dept,
  LoginType,
  Menu,
  ResultData,
  User,
  Workbench,
} from "@/types/api";

export default {
  // login
  login(params: LoginType.params) {
    return request.post<string>("/users/login", params, { showError: false });
  },

  // fetch report data
  getReportData() {
    return request.get<Workbench.ReportData>("/order/workbench/getReportData");
  },

  getLineChartData() {
    return request.get<Workbench.LineChartData>(
      "/order/workbench/getLineChartData"
    );
  },

  getPieAgeChartData() {
    return request.get<Workbench.PieChartData[]>(
      "/order/workbench/getPieAgeChartData"
    );
  },

  getPieCityChartData() {
    return request.get<Workbench.PieChartData[]>(
      "/order/workbench/getPieCityChartData"
    );
  },

  getRadarChartData() {
    return request.get<Workbench.RadarChartData>(
      "/order/workbench/getRadarChartData"
    );
  },

  // user manage
  getUserInfo() {
    return request.get<User.UserItem>("/users/getUserInfo");
  },

  getPermissionList() {
    return request.get<{ buttonList: string[]; menuList: Menu.MenuItem[] }>(
      "/users/getPermissionList"
    );
  },

  getUserList(params: User.Params) {
    return request.get<ResultData<User.UserItem>>("/users/list", params);
  },

  createUser(params: User.CreateParams) {
    return request.post("/users/create", params);
  },
  editUser(params: User.EditParams) {
    return request.post("/users/edit", params);
  },

  delUser(params: number[]) {
    return request.post("/users/delete", params);
  },

  // department manage
  getDeptList(params?: Dept.Params) {
    return request.get<Dept.DeptItem[]>("/dept/list", params);
  },

  getAllUserList() {
    return request.get<User.UserItem[]>("/users/all/list");
  },

  createDept(params: Dept.CreateParams) {
    return request.post("/dept/create", params);
  },

  eidtDept(params: Dept.EditParams) {
    return request.post("/dept/edit", params);
  },

  deleteDept(params: Dept.DelParams) {
    return request.post("/dept/delete", params);
  },

  // menu manage
  getMenuList(params?: Menu.Params) {
    return request.get<Menu.MenuItem[]>("/menu/list", params);
  },

  createMenu(params: Menu.CreateParams) {
    return request.post("/menu/create", params);
  },

  editMenu(params: Menu.EditParams) {
    return request.post("/menu/edit", params);
  },

  deleteMenu(params: Menu.DelParams) {
    return request.post("/menu/delete", params);
  },
};
