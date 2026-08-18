import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { posts } from "./post.schema";
import { commentStatusEnum } from "./enums";

export const comments = pgTable(
  "comments",
  {
    // 主键
    id: uuid("id").primaryKey().defaultRandom(),

    // 关联文章
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    // 评论者信息（游客评论，无需登录）
    authorName: varchar("author_name", { length: 80 }).notNull(),
    authorEmail: varchar("author_email", { length: 120 }),
    authorUrl: varchar("author_url", { length: 300 }),

    // 内容与状态
    content: text("content").notNull(),
    status: commentStatusEnum("status").default("pending"),

    // 来源追踪（服务端采集）
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 500 }),

    // 时间
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_comments_post_created").on(table.postId, table.createdAt),
    index("idx_comments_status").on(table.status),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type CommentRow = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;
