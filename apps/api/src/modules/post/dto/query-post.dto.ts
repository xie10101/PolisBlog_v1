import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const queryPostSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["draft", "published", "scheduled", "deleted"]).optional(),
});

export class QueryPostDto extends createZodDto(queryPostSchema) {}
export type QueryPostDtoType = z.infer<typeof queryPostSchema>;
