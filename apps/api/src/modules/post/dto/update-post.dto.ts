import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { posts } from "../../../db/schema/post.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(posts, {
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200字符"),
  slug: z
    .string()
    .min(1, "slug不能为空")
    .max(200, "slug最多200字符")
    .regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().max(500, "摘要最多500字符"),
  coverImage: z.string().max(500, "封面图URL最多500字符"),
  categoryId: z.string().uuid("分类ID必须是有效的UUID"),
});

// 更新：所有字段可选；authorId / 统计字段 / 时间戳由服务端托管，不可修改
export const UpdatePostSchema = rawUpdateSchema
  .omit({
    id: true,
    authorId: true,
    viewCount: true,
    wordCount: true,
    readTime: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial();

export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
export type UpdatePostDtoType = z.infer<typeof UpdatePostSchema>;
