import {
  pgTable,
  bigserial,
  uuid,
  inet,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { posts } from "./post.schema";

// 文章浏览量记录表（纯追踪，无业务 CRUD）
export const postViews = pgTable(
  "post_views",
  {
    // 主键（bigserial 自增，对应源库 nextval('post_views_id_seq')）
    id: bigserial("id", { mode: "number" }).primaryKey(),

    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    // 访问者信息
    viewerIp: inet("viewer_ip"),
    viewerUa: varchar("viewer_ua", { length: 500 }),
    referrer: varchar("referrer", { length: 1000 }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_post_views_post").on(table.postId),
    index("idx_post_views_created").on(table.createdAt),
    index("idx_post_views_post_created").on(table.postId, table.createdAt),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type PostViewRow = typeof postViews.$inferSelect;
export type PostViewInsert = typeof postViews.$inferInsert;
