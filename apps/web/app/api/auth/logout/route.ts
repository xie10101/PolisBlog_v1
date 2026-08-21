import { NextResponse } from 'next/server';
import { API_BASE_URL, clearRefreshCookie } from '@/lib/auth-cookie';

/**
 * POST /api/auth/logout
 *
 * 后端 logout 受 AuthGuard('jwt') 保护，需要 accessToken，
 * 所以由客户端带上 Authorization 头，这里原样转发。
 */
export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authorization ? { Authorization: authorization } : {},
      cache: 'no-store',
    });
  } catch {
    // 后端清 refreshToken 失败不阻塞前端登出：本地 Cookie 该清还是要清
  }

  await clearRefreshCookie();
  return NextResponse.json({ success: true });
}
