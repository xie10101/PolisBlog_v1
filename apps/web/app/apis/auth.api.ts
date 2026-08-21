import axios from 'axios';
import { AUTH_BFF } from '@/lib/http';
import { authToken } from '@/store/auth';
import type { LoginPayload, LoginResult } from './types';

/**
 * 认证接口。
 *
 * 与其它模块不同，这三个接口打的是 Next 同源 BFF 路由而非 NestJS ——
 * 因为 refreshToken 存在 HttpOnly Cookie 里，只有 Next 服务端能读写。
 * 用裸 axios 而非 lib/http 的实例：这些请求不需要 Bearer 头，
 * 也不该被 401 拦截器接管（否则登录失败会触发刷新递归）。
 */

/** 登录成功后把 accessToken 写进内存 store */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await axios.post<LoginResult>(`${AUTH_BFF}/login`, payload);
  authToken.set(data.accessToken);
  return data;
}

/**
 * 静默刷新。用于应用启动时用 Cookie 里的 refreshToken 换一个 accessToken，
 * 页面刷新后不必重新登录。失败返回 null（未登录或凭证过期），不抛异常。
 */
export async function silentRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post<{ accessToken: string }>(`${AUTH_BFF}/refresh`, {});
    authToken.set(data.accessToken);
    return data.accessToken;
  } catch {
    authToken.clear();
    return null;
  }
}

/** 登出：后端撤销 refreshToken，Next 清 Cookie，本地清内存 */
export async function logout(): Promise<void> {
  const token = authToken.get();
  try {
    await axios.post(
      `${AUTH_BFF}/logout`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    );
  } finally {
    // 后端失败也要清干净本地，否则会卡在「登不出去」的状态
    authToken.clear();
  }
}
