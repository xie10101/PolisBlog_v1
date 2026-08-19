import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { users } from "../../../db/schema/user.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(users, {
  username: z.string().min(1, "用户名不能为空").max(50, "用户名最多50字符"),
  email: z.string().email("邮箱格式不正确").max(100, "邮箱最多100字符"),
});

// 更新：所有字段可选，剔除不可由客户端修改的字段
// passwordHash 换成语义清晰的 password（可选，传了才改密码）
export const UpdateUserSchema = rawUpdateSchema
  .omit({
    id: true,
    passwordHash: true,
    refreshToken: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    password: z.string().min(6, "密码至少6位").max(100, "密码最多100字符").optional(),
  });

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;
