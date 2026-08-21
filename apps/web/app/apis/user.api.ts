import { request } from '@/lib/http';
import type { Paginated, QueryUserParams, RegisterPayload, UpdateUserPayload, User } from './types';

/** 对应 apps/api/src/modules/user/user.controller.ts —— @Controller("admin") */
const BASE = '/admin';

/** 注册。后端标了 @IsPublic()，无需登录态 */
export const register = (payload: RegisterPayload) =>
  request.post<User>(`${BASE}/register`, payload);

export const getUserList = (params?: QueryUserParams) =>
  request.get<Paginated<User>>(BASE, { params });

export const getUserById = (id: string) => request.get<User>(`${BASE}/${id}`);

/** 传了 password 才会改密码，服务端负责 bcrypt */
export const updateUser = (id: string, payload: UpdateUserPayload) =>
  request.put<User>(`${BASE}/${id}`, payload);

export const removeUser = (id: string) => request.delete<User>(`${BASE}/${id}`);
