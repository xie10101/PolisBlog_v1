import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { comments } from "../../../db/schema/comment.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(comments, {
  authorName: z.string().min(1, "昵称不能为空").max(80, "昵称最多80字符"),
  authorEmail: z.string().email("邮箱格式不正确").max(120, "邮箱最多120字符"),
  authorUrl: z.string().max(300, "网址最多300字符"),
  content: z.string().min(1, "评论内容不能为空"),
});

// 更新：主要用于管理员审核（改 status）；postId / 来源追踪 / 时间戳不可修改
export const UpdateCommentSchema = rawUpdateSchema
  .omit({
    id: true,
    postId: true,
    ipHash: true,
    userAgent: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial();

export class UpdateCommentDto extends createZodDto(UpdateCommentSchema) {}
export type UpdateCommentDtoType = z.infer<typeof UpdateCommentSchema>;
