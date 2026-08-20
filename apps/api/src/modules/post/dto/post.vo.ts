import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const postReadStatusSchema = z.enum(["draft", "published", "scheduled", "deleted"]);

// 返回给前端的文章对象（对外状态值与接口文档保持一致）
export const PostVoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  content: z.string(),
  htmlContent: z.string().nullable(),
  coverImage: z.string().nullable(),
  status: postReadStatusSchema,
  viewCount: z.number().int().nullable(),
  wordCount: z.number().int().nullable(),
  readTime: z.number().int().nullable(),
  isTop: z.boolean().nullable(),
  sortOrder: z.number().int().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
});

export class PostVo extends createZodDto(PostVoSchema) {}
export type PostVoType = z.infer<typeof PostVoSchema>;
