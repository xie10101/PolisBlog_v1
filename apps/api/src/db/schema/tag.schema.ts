import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    // 主键
    id: uuid("id").primaryKey().defaultRandom(),

    // 基本信息
    name: varchar("name", { length: 50 }).notNull().unique(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 7 }).default("#3B82F6"),
    description: varchar("description", { length: 200 }),

    // 统计与排序
    postCount: integer("post_count").default(0),
    sortOrder: integer("sort_order").default(0),

    // 时间
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_tags_slug").on(table.slug),
    index("idx_tags_post_count").on(table.postCount.desc()),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type TagRow = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;
