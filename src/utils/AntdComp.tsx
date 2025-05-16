/* eslint-disable react-refresh/only-export-components */
import { App } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, "warn">;

export default () => {
  const antdApp = App.useApp();
  message = antdApp.message;
  modal = antdApp.modal;
  notification = antdApp.notification;
  return null;
};

export { message, notification, modal };
