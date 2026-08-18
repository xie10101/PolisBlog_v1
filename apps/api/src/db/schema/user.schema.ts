import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    // 主键
    id: uuid("id").primaryKey().defaultRandom(),

    // 基本信息
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    email: varchar("email", { length: 100 }),
    avatar: varchar("avatar", { length: 500 }),
    bio: text("bio"),

    // 角色与状态
    role: varchar("role", { length: 20 }).default("admin"),
    status: varchar("status", { length: 20 }).default("active"),

    // jwt相关
    refreshToken: varchar("refresh_token", { length: 1000 }), // 存储refreshToken

    // 时间戳
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_users_username").on(table.username),
    index("idx_users_status").on(table.status),
  ],
);

// drizzle 推导 TS 类型（仅编译期）
export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
