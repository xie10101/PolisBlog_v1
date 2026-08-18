import {
  pgTable,
  integer,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 站点全局信息配置表（单例表，仅 1 行数据）
export const systemInfo = pgTable("system_info", {
  // 主键，单例表固定为 1（CHECK id = 1）
  id: integer("id").primaryKey().default(1),

  // 站点信息
  siteName: varchar("site_name", { length: 100 }).notNull(),
  siteDesc: varchar("site_desc", { length: 500 }),
  siteLogo: varchar("site_logo", { length: 500 }),
  favicon: varchar("favicon", { length: 500 }),
  domain: varchar("domain", { length: 255 }),

  // 作者信息
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorAvatar: varchar("author_avatar", { length: 500 }),
  authorIntro: varchar("author_intro", { length: 500 }),
  authorEmail: varchar("author_email", { length: 255 }),
  github: varchar("github", { length: 500 }),
  gitee: varchar("gitee", { length: 500 }),
  wechat: varchar("wechat", { length: 500 }),
  qq: varchar("qq", { length: 50 }),
  weibo: varchar("weibo", { length: 500 }),
  zhihu: varchar("zhihu", { length: 500 }),
  twitter: varchar("twitter", { length: 500 }),
  linkedin: varchar("linkedin", { length: 500 }),

  // 关于我
  aboutContent: text("about_content"),
  aboutHtml: text("about_html"),
  skills: jsonb("skills").$type<string[]>().default(sql`'[]'::jsonb`),
  resumeUrl: varchar("resume_url", { length: 500 }),

  // SEO
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: varchar("seo_description", { length: 500 }),
  seoKeywords: varchar("seo_keywords", { length: 500 }),
  ogImage: varchar("og_image", { length: 500 }),

  // 视觉与其它
  backgroundImg: varchar("background_img", { length: 500 }),
  themeColor: varchar("theme_color", { length: 20 }).default("#3b82f6"),
  icpNumber: varchar("icp_number", { length: 100 }),
  copyright: varchar("copyright", { length: 255 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// drizzle 推导 TS 类型（仅编译期）
export type SystemInfoRow = typeof systemInfo.$inferSelect;
export type SystemInfoInsert = typeof systemInfo.$inferInsert;
