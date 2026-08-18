import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { users } from "../../../db/schema/user.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(users, {
  username: z.string().min(1, "用户名不能为空").max(50, "用户名最多50字符"),
  passwordHash: z.string().min(1, "密码不能为空").max(255, "密码哈希最多255字符"),
  email: z.string().email("邮箱格式不正确").max(100, "邮箱最多100字符"),
});

// 更新：所有字段可选，剔除不可由客户端修改的字段
export const UpdateUserSchema = rawUpdateSchema
  .omit({
    id: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;
