user

```sql
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default",
    avatar character varying(500) COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default",
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'admin'::character varying,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'active'::character varying,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_unique UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
-- Index: idx_users_status

-- DROP INDEX IF EXISTS public.idx_users_status;

CREATE INDEX IF NOT EXISTS idx_users_status
    ON public.users USING btree
    (status COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_users_username

-- DROP INDEX IF EXISTS public.idx_users_username;

CREATE INDEX IF NOT EXISTS idx_users_username
    ON public.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```



posts

```sql
-- Table: public.posts

-- DROP TABLE IF EXISTS public.posts;

CREATE TABLE IF NOT EXISTS public.posts
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title character varying(200) COLLATE pg_catalog."default" NOT NULL,
    slug character varying(200) COLLATE pg_catalog."default" NOT NULL,
    excerpt character varying(500) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default" NOT NULL,
    html_content text COLLATE pg_catalog."default",
    cover_image character varying(500) COLLATE pg_catalog."default",
    status post_status DEFAULT 'draft'::post_status,
    view_count integer DEFAULT 0,
    word_count integer DEFAULT 0,
    read_time integer DEFAULT 0,
    is_top boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    author_id uuid NOT NULL,
    category_id uuid,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_author_id_users_id_fk FOREIGN KEY (author_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT posts_category_id_categories_id_fk FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts
    OWNER to postgres;
-- Index: idx_posts_author

-- DROP INDEX IF EXISTS public.idx_posts_author;

CREATE INDEX IF NOT EXISTS idx_posts_author
    ON public.posts USING btree
    (author_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_posts_category

-- DROP INDEX IF EXISTS public.idx_posts_category;

CREATE INDEX IF NOT EXISTS idx_posts_category
    ON public.posts USING btree
    (category_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_posts_published_at

-- DROP INDEX IF EXISTS public.idx_posts_published_at;

CREATE INDEX IF NOT EXISTS idx_posts_published_at
    ON public.posts USING btree
    (published_at DESC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_posts_slug

-- DROP INDEX IF EXISTS public.idx_posts_slug;

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug
    ON public.posts USING btree
    (slug COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_posts_status

-- DROP INDEX IF EXISTS public.idx_posts_status;

CREATE INDEX IF NOT EXISTS idx_posts_status
    ON public.posts USING btree
    (status ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_posts_status_published

-- DROP INDEX IF EXISTS public.idx_posts_status_published;

CREATE INDEX IF NOT EXISTS idx_posts_status_published
    ON public.posts USING btree
    (status ASC NULLS LAST, published_at DESC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```



tags

```sql
-- Table: public.tags

-- DROP TABLE IF EXISTS public.tags;

CREATE TABLE IF NOT EXISTS public.tags
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    slug character varying(50) COLLATE pg_catalog."default" NOT NULL,
    color character varying(7) COLLATE pg_catalog."default" DEFAULT '#3B82F6'::character varying,
    description character varying(200) COLLATE pg_catalog."default",
    post_count integer DEFAULT 0,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tags_pkey PRIMARY KEY (id),
    CONSTRAINT tags_name_key UNIQUE (name),
    CONSTRAINT tags_slug_key UNIQUE (slug)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tags
    OWNER to postgres;
-- Index: idx_tags_post_count

-- DROP INDEX IF EXISTS public.idx_tags_post_count;

CREATE INDEX IF NOT EXISTS idx_tags_post_count
    ON public.tags USING btree
    (post_count DESC NULLS FIRST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_tags_slug

-- DROP INDEX IF EXISTS public.idx_tags_slug;

CREATE INDEX IF NOT EXISTS idx_tags_slug
    ON public.tags USING btree
    (slug COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```





 categories

```sql

-- Table: public.categories

-- DROP TABLE IF EXISTS public.categories;

CREATE TABLE IF NOT EXISTS public.categories
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    slug character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description character varying(500) COLLATE pg_catalog."default",
    status category_status DEFAULT 'active'::category_status,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_name_unique UNIQUE (name),
    CONSTRAINT categories_slug_unique UNIQUE (slug)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.categories
    OWNER to postgres;
-- Index: idx_categories_slug

-- DROP INDEX IF EXISTS public.idx_categories_slug;

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug
    ON public.categories USING btree
    (slug COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_categories_sort_order

-- DROP INDEX IF EXISTS public.idx_categories_sort_order;

CREATE INDEX IF NOT EXISTS idx_categories_sort_order
    ON public.categories USING btree
    (sort_order ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_categories_status

-- DROP INDEX IF EXISTS public.idx_categories_status;

CREATE INDEX IF NOT EXISTS idx_categories_status
    ON public.categories USING btree
    (status ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```





comments：



```sql
-- Table: public.comments

-- DROP TABLE IF EXISTS public.comments;

CREATE TABLE IF NOT EXISTS public.comments
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL,
    author_name character varying(80) COLLATE pg_catalog."default" NOT NULL,
    author_email character varying(120) COLLATE pg_catalog."default",
    author_url character varying(300) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default" NOT NULL,
    status comment_status DEFAULT 'pending'::comment_status,
    ip_hash character varying(64) COLLATE pg_catalog."default",
    user_agent character varying(500) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comments
    OWNER to postgres;
-- Index: idx_comments_post_created

-- DROP INDEX IF EXISTS public.idx_comments_post_created;

CREATE INDEX IF NOT EXISTS idx_comments_post_created
    ON public.comments USING btree
    (post_id ASC NULLS LAST, created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_comments_status

-- DROP INDEX IF EXISTS public.idx_comments_status;

CREATE INDEX IF NOT EXISTS idx_comments_status
    ON public.comments USING btree
    (status ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```





post&tag 



```sql
-- Table: public.post_tags

-- DROP TABLE IF EXISTS public.post_tags;

CREATE TABLE IF NOT EXISTS public.post_tags
(
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id),
    CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id)
        REFERENCES public.tags (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post_tags
    OWNER to postgres;
-- Index: idx_post_tags_post

-- DROP INDEX IF EXISTS public.idx_post_tags_post;

CREATE INDEX IF NOT EXISTS idx_post_tags_post
    ON public.post_tags USING btree
    (post_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_post_tags_tag

-- DROP INDEX IF EXISTS public.idx_post_tags_tag;

CREATE INDEX IF NOT EXISTS idx_post_tags_tag
    ON public.post_tags USING btree
    (tag_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```





post—view



```sql
-- Table: public.post_views

-- DROP TABLE IF EXISTS public.post_views;

CREATE TABLE IF NOT EXISTS public.post_views
(
    id bigint NOT NULL DEFAULT nextval('post_views_id_seq'::regclass),
    post_id uuid NOT NULL,
    viewer_ip inet,
    viewer_ua character varying(500) COLLATE pg_catalog."default",
    referrer character varying(1000) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT post_views_pkey PRIMARY KEY (id),
    CONSTRAINT post_views_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post_views
    OWNER to postgres;
-- Index: idx_post_views_created

-- DROP INDEX IF EXISTS public.idx_post_views_created;

CREATE INDEX IF NOT EXISTS idx_post_views_created
    ON public.post_views USING btree
    (created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_post_views_post

-- DROP INDEX IF EXISTS public.idx_post_views_post;

CREATE INDEX IF NOT EXISTS idx_post_views_post
    ON public.post_views USING btree
    (post_id ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: idx_post_views_post_created

-- DROP INDEX IF EXISTS public.idx_post_views_post_created;

CREATE INDEX IF NOT EXISTS idx_post_views_post_created
    ON public.post_views USING btree
    (post_id ASC NULLS LAST, created_at ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
```







system_info


```sql
-- Table: public.system_info

-- DROP TABLE IF EXISTS public.system_info;

CREATE TABLE IF NOT EXISTS public.system_info
(
    id integer NOT NULL DEFAULT 1,
    site_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    site_desc character varying(500) COLLATE pg_catalog."default",
    site_logo character varying(500) COLLATE pg_catalog."default",
    favicon character varying(500) COLLATE pg_catalog."default",
    domain character varying(255) COLLATE pg_catalog."default",
    author_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    author_avatar character varying(500) COLLATE pg_catalog."default",
    author_intro character varying(500) COLLATE pg_catalog."default",
    author_email character varying(255) COLLATE pg_catalog."default",
    github character varying(500) COLLATE pg_catalog."default",
    gitee character varying(500) COLLATE pg_catalog."default",
    wechat character varying(500) COLLATE pg_catalog."default",
    qq character varying(50) COLLATE pg_catalog."default",
    weibo character varying(500) COLLATE pg_catalog."default",
    zhihu character varying(500) COLLATE pg_catalog."default",
    twitter character varying(500) COLLATE pg_catalog."default",
    linkedin character varying(500) COLLATE pg_catalog."default",
    about_content text COLLATE pg_catalog."default",
    about_html text COLLATE pg_catalog."default",
    skills jsonb DEFAULT '[]'::jsonb,
    resume_url character varying(500) COLLATE pg_catalog."default",
    seo_title character varying(255) COLLATE pg_catalog."default",
    seo_description character varying(500) COLLATE pg_catalog."default",
    seo_keywords character varying(500) COLLATE pg_catalog."default",
    og_image character varying(500) COLLATE pg_catalog."default",
    background_img character varying(500) COLLATE pg_catalog."default",
    theme_color character varying(20) COLLATE pg_catalog."default" DEFAULT '#3b82f6'::character varying,
    icp_number character varying(100) COLLATE pg_catalog."default",
    copyright character varying(255) COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT system_info_pkey PRIMARY KEY (id),
    CONSTRAINT system_info_id_check CHECK (id = 1)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.system_info
    OWNER to postgres;

COMMENT ON TABLE public.system_info
    IS '站点全局信息配置表（单例表，仅1行数据）';

COMMENT ON COLUMN public.system_info.id
    IS '主键，单例表固定为1';

COMMENT ON COLUMN public.system_info.site_name
    IS '站点名称';

COMMENT ON COLUMN public.system_info.site_desc
    IS '站点描述/副标题';

COMMENT ON COLUMN public.system_info.site_logo
    IS '站点Logo图片URL';

COMMENT ON COLUMN public.system_info.favicon
    IS '网站图标URL';

COMMENT ON COLUMN public.system_info.domain
    IS '站点域名，用于生成绝对链接和sitemap';

COMMENT ON COLUMN public.system_info.author_name
    IS '作者/站长名称';

COMMENT ON COLUMN public.system_info.author_avatar
    IS '作者头像URL';

COMMENT ON COLUMN public.system_info.author_intro
    IS '作者一句话简介';

COMMENT ON COLUMN public.system_info.author_email
    IS '作者联系邮箱';

COMMENT ON COLUMN public.system_info.github
    IS 'GitHub主页URL';

COMMENT ON COLUMN public.system_info.gitee
    IS 'Gitee主页URL';

COMMENT ON COLUMN public.system_info.wechat
    IS '微信号或微信二维码图片URL';

COMMENT ON COLUMN public.system_info.qq
    IS 'QQ号';

COMMENT ON COLUMN public.system_info.weibo
    IS '微博主页URL';

COMMENT ON COLUMN public.system_info.zhihu
    IS '知乎主页URL';

COMMENT ON COLUMN public.system_info.twitter
    IS 'Twitter/X主页URL';

COMMENT ON COLUMN public.system_info.linkedin
    IS 'LinkedIn主页URL';

COMMENT ON COLUMN public.system_info.about_content
    IS '关于我长文内容（Markdown格式）';

COMMENT ON COLUMN public.system_info.about_html
    IS '关于我渲染后的HTML';

COMMENT ON COLUMN public.system_info.skills
    IS '技能标签数组（JSONB）';

COMMENT ON COLUMN public.system_info.resume_url
    IS '简历下载链接URL';

COMMENT ON COLUMN public.system_info.seo_title
    IS 'SEO标题模板';

COMMENT ON COLUMN public.system_info.seo_description
    IS '默认SEO描述';

COMMENT ON COLUMN public.system_info.seo_keywords
    IS 'SEO关键词（逗号分隔）';

COMMENT ON COLUMN public.system_info.og_image
    IS '默认分享封面图（Open Graph）';

COMMENT ON COLUMN public.system_info.background_img
    IS '站点背景图URL';

COMMENT ON COLUMN public.system_info.theme_color
    IS '主题色（HEX值）';

COMMENT ON COLUMN public.system_info.icp_number
    IS 'ICP备案号';

COMMENT ON COLUMN public.system_info.copyright
    IS '版权信息';

COMMENT ON COLUMN public.system_info.created_at
    IS '创建时间';

COMMENT ON COLUMN public.system_info.updated_at
    IS '最后更新时间';

-- Trigger: trigger_system_info_updated_at

-- DROP TRIGGER IF EXISTS trigger_system_info_updated_at ON public.system_info;

CREATE OR REPLACE TRIGGER trigger_system_info_updated_at
    BEFORE UPDATE 
    ON public.system_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_system_info_updated_at();
```

