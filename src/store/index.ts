import { create } from "zustand";
import { User } from "@/types/api";
import storage from "@/utils/storage";

interface UseStore {
  isDark: boolean;
  updateTheme: (isDark: boolean) => void;

  collapsed: boolean;
  updateCollapsed: () => void;

  token: string;
  updateToken: (token: string) => void;

  userInfo: User.UserItem;
  updateUserInfo: (userInfo: User.UserItem) => void;
}

export const useStore = create<UseStore>((set) => ({
  isDark: storage.get("isDark") || false,
  updateTheme: (isDark: boolean) => set({ isDark }),

  collapsed: false,
  updateCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

  token: "",
  updateToken: (token: string) => set({ token }),

  userInfo: {
    _id: "",
    userId: 0,
    userName: "",
    userEmail: "",
    deptId: "",
    state: 0,
    mobile: "",
    job: "",
    role: 0,
    roleList: "",
    createTime: "",
    deptName: "",
    userImg: "",
  },
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
}));
