import { pgEnum } from "drizzle-orm/pg-core";

// 枚举类型定义（与源数据库 CREATE TYPE 保持一致）

// 文章状态：草稿 / 待审核 / 发布 / 回收站
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "pending",
  "published",
  "trash",
]);

// 分类状态：启用 / 停用
export const categoryStatusEnum = pgEnum("category_status", [
  "active",
  "inactive",
]);

// 评论状态：待审核 / 已通过 / 垃圾 / 已拒绝
// ⚠️ 评论表为新增表，源库无此枚举定义，此组值根据业务推断，需与目标库实际定义核对
export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "spam",
  "rejected",
]);
