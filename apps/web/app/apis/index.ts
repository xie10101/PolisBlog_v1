/**
 * 请求层统一出口。
 *
 * 用法：import { postApi, ApiError } from '@/app/apis'
 *      const { list, total } = await postApi.getPostList({ page: 1, pageSize: 10 })
 *
 * 这些函数只能在客户端组件里调用（依赖内存中的 accessToken）。
 * 服务端组件 / Server Action 请直接用 fetch + cookies()，
 * 那样才能配合 use cache / cacheTag。
 */
export * as authApi from './auth.api';
export * as postApi from './post.api';
export * as categoryApi from './category.api';
export * as userApi from './user.api';

export * from './types';
export { ApiError } from '@/lib/http';
