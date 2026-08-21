import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface UserInfo {
  id: string | null;
  email: string | null;
  avatar: string | null;
  username: string | null;
  bio: string | null;
}

interface UserInfoStore extends UserInfo {
  // 设置/更新用户信息（支持部分更新）
  setInfo: (info: Partial<UserInfo>) => void;
  // 清空用户信息（恢复初始状态）
  clearInfo: () => void;
}

const initialState: UserInfo = {
  id: null,
  email: null,
  avatar: null,
  username: null,
  bio: null,
};

const useUserInfoStore = create<UserInfoStore>()(
  persist(
    set => ({
      ...initialState,

      setInfo: info =>
        set(state => ({
          ...state,
          ...info,
        })),

      clearInfo: () => set(initialState),
    }),
    {
      name: 'app-storage',
    },
  ),
);

export default useUserInfoStore;
//  persist 本质运行 ：
// 在每次项目刷新时会自动从本地存储读取 -> 初始化 Zustand 状态
// 在状态更新时会自动将新的状态保存到本地存储中