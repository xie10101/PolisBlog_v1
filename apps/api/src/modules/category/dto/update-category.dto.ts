import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { categories } from "../../../db/schema/category.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(categories, {
  name: z.string().min(1, "分类名称不能为空").max(100, "分类名称最多100字符"),
  slug: z
    .string()
    .min(1, "slug不能为空")
    .max(100, "slug最多100字符")
    .regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  description: z.string().max(500, "描述最多500字符"),
});

// 更新：所有字段可选
export const UpdateCategorySchema = rawUpdateSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial();

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
export type UpdateCategoryDtoType = z.infer<typeof UpdateCategorySchema>;
