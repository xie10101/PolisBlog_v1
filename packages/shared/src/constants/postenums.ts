export type ApiPostStatus = "draft" | "published" | "scheduled" | "deleted";

export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
  DELETED = "deleted",
}

// 客户端需要的文章状态
