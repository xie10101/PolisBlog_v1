import { NextResponse } from 'next/server';
import {
  API_BASE_URL,
  clearRefreshCookie,
  readRefreshCookie,
  setRefreshCookie,
  type ApiResult,
} from '@/lib/auth-cookie';

/**
 * POST /api/auth/refresh
 *
 * 由 lib/http.ts 的 401 拦截器调用。客户端不传任何凭证 ——
 * refreshToken 从 HttpOnly Cookie 里取，这是它唯一的存放处。
 */
export async function POST() {
  const refreshToken = await readRefreshCookie();
  if (!refreshToken) {
    return NextResponse.json({ message: '未登录' }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ message: '认证服务不可用' }, { status: 502 });
  }

  const result = (await upstream.json()) as ApiResult<{
    accessToken: string;
    refreshToken?: string;
  }>;

  if (!upstream.ok || !result.data) {
    // refreshToken 已失效或被撤销（后端 TOKEN_INVALID / TOKEN_REVOKED），清掉脏 Cookie
    await clearRefreshCookie();
    return NextResponse.json({ message: result?.message ?? '登录已过期' }, { status: 401 });
  }

  // 后端目前复用旧 refreshToken 不做轮换；这里做兼容处理，
  // 将来 auth.service 改成轮换下发时无需再动本文件
  if (result.data.refreshToken) {
    await setRefreshCookie(result.data.refreshToken);
  }

  return NextResponse.json({ accessToken: result.data.accessToken });
}
