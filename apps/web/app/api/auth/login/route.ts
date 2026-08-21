import { NextResponse } from 'next/server';
import { API_BASE_URL, setRefreshCookie, type ApiResult } from '@/lib/auth-cookie';

/**
 * POST /api/auth/login
 *
 * BFF 登录代理：把 NestJS 返回的双 token 拆开处理 ——
 * refreshToken 落进 HttpOnly Cookie（浏览器 JS 永远看不到），
 * accessToken 回给客户端存内存。
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '请求体格式错误' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ message: '认证服务不可用' }, { status: 502 });
  }

  const result = (await upstream.json()) as ApiResult<{
    accessToken: string;
    refreshToken: string;
  }>;

  if (!upstream.ok || !result.data) {
    // 透传后端业务文案（如「用户名或密码错误」）
    return NextResponse.json(
      { message: result?.message ?? '登录失败' },
      { status: upstream.status },
    );
  }

  const { accessToken, refreshToken } = result.data;
  await setRefreshCookie(refreshToken);

  // 注意：响应体里刻意不含 refreshToken
  return NextResponse.json({ accessToken });
}
