/**
 * 与 apps/api 各模块 VO / DTO 对齐的客户端类型。
 *
 * 注意：后端 VO 里的时间字段是 `z.date()`，但经 JSON 传输后到客户端一律是
 * ISO 字符串，所以这里统一声明为 string —— 直接照抄后端类型会踩坑。
 */

/* ============================== 通用 ============================== */

export interface PageQuery {
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* ============================== 认证 ============================== */

export interface LoginPayload {
  username: string;
  password: string;
}

/** BFF 只回 accessToken，refreshToken 在 HttpOnly Cookie 里 */
export interface LoginResult {
  accessToken: string;
}

/* ============================== 文章 ============================== */

/** 对外可读状态，见 apps/api/src/modules/post/dto/post.vo.ts */
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'deleted';

/** 可写状态（deleted 由软删除接口产生，不能直接写） */
export type PostWriteStatus = 'draft' | 'published' | 'scheduled';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  htmlContent: string | null;
  coverImage: string | null;
  status: PostStatus;
  viewCount: number | null;
  wordCount: number | null;
  readTime: number | null;
  isTop: boolean | null;
  sortOrder: number | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  authorId: string;
  categoryId: string | null;
}

/** authorId / 统计字段 / 时间戳由服务端托管，不可传 */
export interface CreatePostPayload {
  title: string;
  slug: string;
  content: string;
  htmlContent?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostWriteStatus;
  isTop?: boolean;
  sortOrder?: number;
  publishedAt?: string;
  categoryId?: string | null;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface QueryPostParams extends PageQuery {
  status?: PostStatus;
}

/* ============================== 分类 ============================== */

export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus | null;
  sortOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  status?: CategoryStatus;
  sortOrder?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type QueryCategoryParams = PageQuery;

/* ============================== 用户 ============================== */

export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar: string | null;
  bio: string | null;
  role: string | null;
  status: string | null;
  lastLoginAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/** 注册：password 传明文，服务端 bcrypt 后落库 */
export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  status?: string;
}

export interface QueryUserParams extends PageQuery {
  username?: string;
  email?: string;
}
