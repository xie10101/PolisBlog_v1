import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// 分页 + 多参数查询（username / email 模糊匹配）
const queryUserSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  username: z.string().optional(),
  email: z.string().optional(),
});

export class QueryUserDto extends createZodDto(queryUserSchema) {}
export type QueryUserDtoType = z.infer<typeof queryUserSchema>;
