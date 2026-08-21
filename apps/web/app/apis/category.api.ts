import { request } from '@/lib/http';
import type {
  Category,
  CreateCategoryPayload,
  Paginated,
  QueryCategoryParams,
  UpdateCategoryPayload,
} from './types';

/** 对应 apps/api/src/modules/category/category.controller.ts —— @Controller("dashboard/categories") */
const BASE = '/dashboard/categories';

export const createCategory = (payload: CreateCategoryPayload) =>
  request.post<Category>(BASE, payload);

export const getCategoryList = (params?: QueryCategoryParams) =>
  request.get<Paginated<Category>>(BASE, { params });

export const getCategoryById = (id: string) => request.get<Category>(`${BASE}/${id}`);

export const updateCategory = (id: string, payload: UpdateCategoryPayload) =>
  request.put<Category>(`${BASE}/${id}`, payload);

export const removeCategory = (id: string) => request.delete<Category>(`${BASE}/${id}`);

/**
 * 后端目前缺「状态变更」和「批量硬删除」两个接口
 * （见 category.controller.ts 末尾的 TODO 注释），补齐后在此追加。
 */
