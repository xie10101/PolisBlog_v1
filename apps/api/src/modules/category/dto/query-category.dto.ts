import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const queryCategorySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export class QueryCategoryDto extends createZodDto(queryCategorySchema) {}
export type QueryCategoryDtoType = z.infer<typeof queryCategorySchema>;

/**
 * 待扩展分类名称查询
 */
