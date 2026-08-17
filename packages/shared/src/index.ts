export const APP_NAME = "PolisBlog";

/** 文章发布状态 */
export type PostStatus = "draft" | "published" | "archived";

/** 用户角色 */
export type UserRole = "admin" | "editor" | "viewer";

/** 博客文章 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

/** 用户 */
export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
}

/**
 * API 统一响应结构。
 *
 * 对应 `feat/responsehandle` 分支「统一响应处理」的约定，
 * 后续迁移 actionHandler / apiHandler 时复用。
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}
