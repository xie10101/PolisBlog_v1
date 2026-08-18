import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { posts } from "./post.schema";
import { tags } from "./tag.schema";

// 文章-标签 多对多关联表
export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("idx_post_tags_post").on(table.postId),
    index("idx_post_tags_tag").on(table.tagId),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type PostTagRow = typeof postTags.$inferSelect;
export type PostTagInsert = typeof postTags.$inferInsert;
