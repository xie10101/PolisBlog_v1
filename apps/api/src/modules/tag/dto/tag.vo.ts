import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { tags } from "../../../db/schema/tag.schema";
import { z } from "zod";

// 返回给前端的标签对象
export const TagVoSchema = createSelectSchema(tags);

export class TagVo extends createZodDto(TagVoSchema) {}
export type TagVoType = z.infer<typeof TagVoSchema>;
