import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { tags } from "../../../db/schema/tag.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(tags, {
  name: z.string().min(1, "标签名称不能为空").max(50, "标签名称最多50字符"),
  slug: z
    .string()
    .min(1, "slug不能为空")
    .max(50, "slug最多50字符")
    .regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "颜色必须是6位HEX值"),
  description: z.string().max(200, "描述最多200字符"),
});

// 更新：所有字段可选；postCount 由系统维护，不可修改
export const UpdateTagSchema = rawUpdateSchema
  .omit({
    id: true,
    postCount: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export class UpdateTagDto extends createZodDto(UpdateTagSchema) {}
export type UpdateTagDtoType = z.infer<typeof UpdateTagSchema>;
