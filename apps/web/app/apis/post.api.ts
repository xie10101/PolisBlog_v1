import { request } from '@/lib/http';
import type {
  CreatePostPayload,
  Paginated,
  Post,
  QueryPostParams,
  UpdatePostPayload,
} from './types';

/** 对应 apps/api/src/modules/post/post.controller.ts —— @Controller("dashboard/posts") */
const BASE = '/dashboard/posts';

/** 创建文章。authorId 由后端从 JWT 中取，不用传 */
export const createPost = (payload: CreatePostPayload) => request.post<Post>(BASE, payload);

/** 分页查询文章列表 */
export const getPostList = (params?: QueryPostParams) =>
  request.get<Paginated<Post>>(BASE, { params });

/** 按 id 查询单篇（后端用 ParseUUIDPipe 校验，非 UUID 会 400） */
export const getPostById = (id: string) => request.get<Post>(`${BASE}/${id}`);

export const updatePost = (id: string, payload: UpdatePostPayload) =>
  request.put<Post>(`${BASE}/${id}`, payload);

/** 软删除，进回收站（status 变为 deleted） */
export const removePost = (id: string) => request.delete<Post>(`${BASE}/${id}`);

/** 从回收站恢复 */
export const restorePost = (id: string) => request.post<Post>(`${BASE}/${id}/restore`);

/** 物理删除，不可逆 */
export const destroyPost = (id: string) => request.delete<void>(`${BASE}/${id}/destroy`);
