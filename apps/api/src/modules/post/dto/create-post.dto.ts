import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { posts } from "../../../db/schema/post.schema";
import { z } from "zod";

const postWriteStatusSchema = z.enum(["draft", "published", "scheduled"]);

// 基于 drizzle 表生成 zod schema，并额外增强校验规则
const rawCreateSchema = createInsertSchema(posts, {
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200字符"),
  slug: z
    .string()
    .min(1, "slug不能为空")
    .max(200, "slug最多200字符")
    .regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空"),
  htmlContent: z.string().optional(),
  excerpt: z.string().max(500, "摘要最多500字符").optional(),
  coverImage: z.string().max(500, "封面图URL最多500字符").optional(),
  status: postWriteStatusSchema.optional(),
  isTop: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  publishedAt: z.coerce.date().optional(),
});
export const CreatePostSchema = rawCreateSchema.omit({
  // 剔除服务端托管字段（id / 作者 / 统计计数 / 时间戳 / 软删除）
  id: true,
  viewCount: true,
  authorId: true,
  wordCount: true,
  readTime: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
export type CreatePostDtoType = z.infer<typeof CreatePostSchema>;
