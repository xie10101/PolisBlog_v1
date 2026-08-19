import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { users } from "../../../db/schema/user.schema";
import { z } from "zod";

// 基于 drizzle 表生成 zod schema，并额外增强校验规则
const rawCreateSchema = createInsertSchema(users, {
  username: z.string().min(1, "用户名不能为空").max(50, "用户名最多50字符"),
  email: z.string().email("邮箱格式不正确").max(100, "邮箱最多100字符").optional(),
});

// 剔除后端托管字段（id / role / status / refreshToken / 时间戳由服务端生成）
// passwordHash 换成语义清晰的 password：客户端传明文，service 里 bcrypt 后写入 DB
export const CreateUserSchema = rawCreateSchema
  .omit({
    id: true,
    passwordHash: true,
    role: true,
    status: true,
    refreshToken: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(6, "密码至少6位").max(100, "密码最多100字符"),
  });

//nestjs-zod帮助使用校验管道
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
