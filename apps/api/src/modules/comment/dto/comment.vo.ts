import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { comments } from "../../../db/schema/comment.schema";
import { z } from "zod";

// 返回给前端的评论对象，剔除隐私字段 ipHash
export const CommentVoSchema = createSelectSchema(comments).omit({
  ipHash: true,
});

export class CommentVo extends createZodDto(CommentVoSchema) {}
export type CommentVoType = z.infer<typeof CommentVoSchema>;
