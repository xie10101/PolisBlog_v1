import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { categories } from "../../../db/schema/category.schema";
import { z } from "zod";

const rawCreateSchema = createInsertSchema(categories, {
  name: z.string().min(1, "分类名称不能为空").max(100, "分类名称最多100字符"),
  slug: z
    .string()
    .min(1, "slug不能为空")
    .max(100, "slug最多100字符")
    .regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  description: z.string().max(500, "描述最多500字符").optional(),
});

// 剔除服务端托管字段（id / 时间戳 / 软删除）
export const CreateCategorySchema = rawCreateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export type CreateCategoryDtoType = z.infer<typeof CreateCategorySchema>;
