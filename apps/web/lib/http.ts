import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authToken } from '@/store/auth';

/**
 * 浏览器侧 HTTP 客户端。
 *
 * 数据类请求直连 NestJS（:3001），靠 Authorization 头鉴权；
 * 认证类请求（login / refresh / logout）走 Next 同源路由，
 * 因为 refreshToken 存在 HttpOnly Cookie 里，只有 Next 服务端读得到。
 *
 * 服务端组件 / Server Action 不要 import 本文件 —— 那边用 fetch + cookies()。
 */

/** NestJS 统一响应体，见 apps/api/src/common/dto/result.dto.ts */
export interface Result<T> {
  code: number;
  message: string;
  data: T | null;
}

/** 列表接口统一分页形状 */
export interface Paginated<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 归一化后的业务错误，组件层只需要认这一种 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly raw?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

/** Next 侧 BFF 认证路由前缀（同源，无需 CORS） */
export const AUTH_BFF = '/api/auth';

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 请求拦截器：附带 accessToken
 */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authToken.get();
  if (token) {
    // Axios v1 的 headers 是 AxiosHeaders 实例，用 set 而非直接赋值
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/*
   关键处理 
 * 并发 5 个请求同时 401 时，只允许第一个真正去刷新，
 * 其余挂在 queue 上等新 token，避免把 refreshToken 打成竞态。
 */
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

/**
 * 处理并清空等待队列中的所有回调函数
 * @param token - 用于验证或标识的令牌字符串，可能为null
 */
/**
 * 处理等待队列中的所有回调函数
 * @param token - 可以是字符串或null的参数，将作为参数传递给队列中的每个回调函数
 */
function flushQueue(token: string | null) {
  // 遍历pendingQueue中的所有回调函数并执行它们，传入token作为参数
  pendingQueue.forEach(resolve => resolve(token));
  // 清空等待队列，以便接收新的回调函数
  pendingQueue = [];
}

/** 调 Next BFF 换新 accessToken。用裸 axios，避免走进本实例的拦截器造成递归 */
async function requestRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post<{ accessToken: string }>(
      `${AUTH_BFF}/refresh`,
      {},
      { timeout: 10_000 },
    );
    return data?.accessToken ?? null;
  } catch {
    return null;
  }
}

/** 刷新彻底失败：清空内存态并跳登录 */
function handleAuthFailure() {
  authToken.clear();
  if (
    typeof window !== 'undefined' &&
    !window.location.pathname.startsWith('/login')
  ) {
    const from = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    window.location.href = `/login?from=${from}`;
  }
}

/* ------------------------------------------------------------------ *
 * 响应拦截器：拆信封 + 401 刷新重放 + 错误归一化
 * ------------------------------------------------------------------ */
http.interceptors.response.use(
  // 后端成功响应恒为 { code: 200, message, data }，这里直接把 data 剥出来，
  // 业务代码拿到的就是纯数据，不用层层 res.data.data
  response => response.data?.data,

  async (error: AxiosError<Result<never>>) => {
    // 设置——retry 属性 以及联合类型
    const config = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    // 无响应：断网 / 超时 / CORS 被拦
    if (!error.response || !config) {
      const isTimeout = error.code === 'ECONNABORTED';
      return Promise.reject(
        new ApiError(
          isTimeout ? '请求超时，请重试' : '网络异常，请检查连接',
          0,
          error,
        ),
      );
    }
    // 身份验证失败
    if (status === 401 && !config._retry) {
      config._retry = true;

      // 已有刷新在飞：排队等结果
      if (isRefreshing) {
        // 拿到最初的resolve token结果
        const token = await new Promise<string | null>(resolve =>
          pendingQueue.push(resolve),
        );
        // token 为空 →先前的请求没有拿到token
        if (!token)
          return Promise.reject(
            new ApiError('登录已过期，请重新登录', 401, error),
          );
        return http(config);
      }

      // 刷新操作
      isRefreshing = true;
      const newToken = await requestRefresh();
      isRefreshing = false;

      if (!newToken) {
        flushQueue(null);
        handleAuthFailure();
        return Promise.reject(
          new ApiError('登录已过期，请重新登录', 401, error),
        );
      }

      authToken.set(newToken);
      flushQueue(newToken);
      return http(config); // 重放原请求，请求拦截器会自动带上新 token
    }
    /**
     * config 里装着原请求的完整描述 —— url、method、data、params、headers、baseURL、timeout，外加我们挂的 _retry。
     * 所以 http(config) 的语义就是：照着原样，把这个请求重新发一次
     */

    // 刷新后仍 401 → 凭证确实失效 - refresh-token仍然失效
    if (status === 401) {
      handleAuthFailure();
      return Promise.reject(new ApiError('登录已过期，请重新登录', 401, error));
    }

    // 其余业务错误：后端 message 已是可直接展示的文案（见 business-code.ts）
    const payload = error.response.data;
    return Promise.reject(
      new ApiError(
        payload?.message || `请求失败（${status}）`,
        payload?.code ?? status ?? 500,
        error,
      ),
    );
  },
);

/**
 * 类型化的请求辅助函数。
 *
 * 因为响应拦截器已经拆掉了信封，这里的返回类型直接就是业务数据 T，
 * 但 axios 的类型签名仍以为返回的是 AxiosResponse，故需要断言收口。
 */
export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    http.get(url, config) as Promise<T>,
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    http.post(url, body, config) as Promise<T>,
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    http.put(url, body, config) as Promise<T>,
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    http.delete(url, config) as Promise<T>,
};

export default http;
