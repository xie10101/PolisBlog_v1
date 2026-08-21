import { cookies } from 'next/headers';

/**
 * refreshToken 的 HttpOnly Cookie 托管。
 * 只在 Route Handler / Server Action 中使用 —— 只有那里能写响应头。
 */

export const REFRESH_COOKIE = 'polis_rt';

/** 与后端 JWT_REFRESH_EXPIRES_IN=7d 对齐 */
const MAX_AGE = 60 * 60 * 24 * 7;

const isProd = process.env.NODE_ENV === 'production';

export async function setRefreshCookie(token: string) {
  const store = await cookies();
  store.set(REFRESH_COOKIE, token, {
    httpOnly: true, // JS 读不到，XSS 拿不走
    secure: isProd, // 本地 http 调试需要关掉，线上必须开
    sameSite: 'lax', // 阻断跨站 CSRF，同时不影响站内导航
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function readRefreshCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function clearRefreshCookie() {
  const store = await cookies();
  store.delete(REFRESH_COOKIE);
}

/** 服务端访问 NestJS 的地址（可用非公开变量覆盖，避免内网地址泄漏到客户端包） */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

/** NestJS 统一响应体 */
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T | null;
}
