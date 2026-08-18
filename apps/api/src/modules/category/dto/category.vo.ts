import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { categories } from "../../../db/schema/category.schema";
import { z } from "zod";

// 返回给前端的分类对象
export const CategoryVoSchema = createSelectSchema(categories);

export class CategoryVo extends createZodDto(CategoryVoSchema) {}
export type CategoryVoType = z.infer<typeof CategoryVoSchema>;
