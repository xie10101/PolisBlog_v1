import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { comments } from "../../../db/schema/comment.schema";
import { z } from "zod";

const rawCreateSchema = createInsertSchema(comments, {
  authorName: z.string().min(1, "昵称不能为空").max(80, "昵称最多80字符"),
  authorEmail: z
    .string()
    .email("邮箱格式不正确")
    .max(120, "邮箱最多120字符")
    .optional(),
  authorUrl: z.string().max(300, "网址最多300字符").optional(),
  content: z.string().min(1, "评论内容不能为空"),
});

// 剔除服务端托管字段（id / status 默认 pending 由后端控制 / 来源追踪 / 时间戳 / 软删除）
// 注：postId 实际常由路由参数注入，此处按字段保留必填
export const CreateCommentSchema = rawCreateSchema.omit({
  id: true,
  status: true,
  ipHash: true,
  userAgent: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {}
export type CreateCommentDtoType = z.infer<typeof CreateCommentSchema>;
