import { RefObject } from "react";
export type IAction = "create" | "edit" | "delete";

export interface IModalProp<T> {
  mRef: RefObject<{
    open: (type: IAction, data?: T) => void;
  } | null>;
  update: () => void;
}
