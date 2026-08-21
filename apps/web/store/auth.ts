import { create } from 'zustand';

/**
 * accessToken 内存态。
 * 刻意不接 persist —— 一旦落进 localStorage，XSS 就能直接读走凭证，
 * 混合式方案的安全收益也就没了。刷新页面丢失是预期行为：
 * 长效凭证 refreshToken 在 HttpOnly Cookie 里，
 * 由 lib/http.ts 的响应拦截器静默换回新的 accessToken。
 */
interface AuthState {
  accessToken: string | null;
  /** 是否已尝试过首次静默刷新，避免应用启动时重复打 refresh */
  bootstrapped: boolean;
  setAccessToken: (token: string | null) => void;
  setBootstrapped: (value: boolean) => void;
  clear: () => void;
}

const useAuthStore = create<AuthState>()(set => ({
  accessToken: null,
  bootstrapped: false,

  setAccessToken: token => set({ accessToken: token }),
  setBootstrapped: value => set({ bootstrapped: value }),
  clear: () => set({ accessToken: null, bootstrapped: true }),
}));

export default useAuthStore;

/**
 * 供非 React 环境（axios 拦截器）读写的快捷方法。
 * zustand 的 getState/setState 脱离组件树也能用，这正是拦截器需要的。
 */
export const authToken = {
  get: () => useAuthStore.getState().accessToken,
  set: (token: string | null) => useAuthStore.getState().setAccessToken(token),
  clear: () => useAuthStore.getState().clear(),
};
