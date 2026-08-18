import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { categoryStatusEnum } from "./enums";

export const categories = pgTable(
  "categories",
  {
    // 主键
    id: uuid("id").primaryKey().defaultRandom(),

    // 基本信息
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 500 }),

    // 状态
    status: categoryStatusEnum("status").default("active"),

    // 排序
    sortOrder: integer("sort_order").default(0),

    // 时间
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("idx_categories_slug").on(table.slug),
    index("idx_categories_status").on(table.status),
    index("idx_categories_sort_order").on(table.sortOrder),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type CategoryRow = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;
