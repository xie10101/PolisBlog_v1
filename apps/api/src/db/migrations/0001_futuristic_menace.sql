CREATE TYPE "public"."category_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'spam', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'pending', 'published', 'trash');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" varchar(500),
	"status" "category_status" DEFAULT 'active',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_name" varchar(80) NOT NULL,
	"author_email" varchar(120),
	"author_url" varchar(300),
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending',
	"ip_hash" varchar(64),
	"user_agent" varchar(500),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"email" varchar(100),
	"avatar" varchar(500),
	"bio" text,
	"role" varchar(20) DEFAULT 'admin',
	"status" varchar(20) DEFAULT 'active',
	"refresh_token" varchar(1000),
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"excerpt" varchar(500),
	"content" text NOT NULL,
	"html_content" text,
	"cover_image" varchar(500),
	"status" "post_status" DEFAULT 'draft',
	"view_count" integer DEFAULT 0,
	"word_count" integer DEFAULT 0,
	"read_time" integer DEFAULT 0,
	"is_top" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	"author_id" uuid NOT NULL,
	"category_id" uuid
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"color" varchar(7) DEFAULT '#3B82F6',
	"description" varchar(200),
	"post_count" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "post_views" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"viewer_ip" "inet",
	"viewer_ua" varchar(500),
	"referrer" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_info" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_name" varchar(100) NOT NULL,
	"site_desc" varchar(500),
	"site_logo" varchar(500),
	"favicon" varchar(500),
	"domain" varchar(255),
	"author_name" varchar(100) NOT NULL,
	"author_avatar" varchar(500),
	"author_intro" varchar(500),
	"author_email" varchar(255),
	"github" varchar(500),
	"gitee" varchar(500),
	"wechat" varchar(500),
	"qq" varchar(50),
	"weibo" varchar(500),
	"zhihu" varchar(500),
	"twitter" varchar(500),
	"linkedin" varchar(500),
	"about_content" text,
	"about_html" text,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"resume_url" varchar(500),
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"seo_keywords" varchar(500),
	"og_image" varchar(500),
	"background_img" varchar(500),
	"theme_color" varchar(20) DEFAULT '#3b82f6',
	"icp_number" varchar(100),
	"copyright" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "article" CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_categories_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_categories_status" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_categories_sort_order" ON "categories" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_comments_post_created" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_comments_status" ON "comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_posts_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_posts_status" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_posts_published_at" ON "posts" USING btree ("published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_posts_status_published" ON "posts" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_posts_author" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_posts_category" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_tags_slug" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_tags_post_count" ON "tags" USING btree ("post_count" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_post_tags_post" ON "post_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_post_tags_tag" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_post_views_post" ON "post_views" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_post_views_created" ON "post_views" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_post_views_post_created" ON "post_views" USING btree ("post_id","created_at");