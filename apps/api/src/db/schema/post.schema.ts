import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { categories } from "./category.schema";
import { postStatusEnum } from "./enums";

export const posts = pgTable(
  "posts",
  {
    // 主键
    id: uuid("id").primaryKey().defaultRandom(),

    // 基本信息
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }),
    content: text("content").notNull(),
    htmlContent: text("html_content"),

    // 媒体
    coverImage: varchar("cover_image", { length: 500 }),

    // 状态
    status: postStatusEnum("status").default("draft"),

    // 统计
    viewCount: integer("view_count").default(0),
    wordCount: integer("word_count").default(0),
    readTime: integer("read_time").default(0),

    // 排序
    isTop: boolean("is_top").default(false),
    sortOrder: integer("sort_order").default(0),

    // 时间
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    // 外键
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("idx_posts_slug").on(table.slug),
    index("idx_posts_status").on(table.status),
    index("idx_posts_published_at").on(table.publishedAt.desc()),
    index("idx_posts_status_published").on(
      table.status,
      table.publishedAt.desc(),
    ),
    index("idx_posts_author").on(table.authorId),
    index("idx_posts_category").on(table.categoryId),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type PostRow = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;
