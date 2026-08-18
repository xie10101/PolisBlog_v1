import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { users } from "../../../db/schema/user.schema";
import { z } from "zod";

// 基于 drizzle 表生成 zod schema，并额外增强校验规则
const rawCreateSchema = createInsertSchema(users, {
  username: z.string().min(1, "用户名不能为空").max(50, "用户名最多50字符"),
  passwordHash: z.string().min(1, "密码不能为空").max(255, "密码哈希最多255字符"),
  email: z.string().email("邮箱格式不正确").max(100, "邮箱最多100字符").optional(),
});

// 剔除后端托管字段（id / 时间戳由服务端生成）
// 注：passwordHash 对应 DB 字段，实际由 service 将明文密码 bcrypt 后写入
export const CreateUserSchema = rawCreateSchema.omit({
  id: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
