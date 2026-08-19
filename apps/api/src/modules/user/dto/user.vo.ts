import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { users } from "../../../db/schema/user.schema";
import { z } from "zod";

// 返回给前端的用户对象，剔除敏感字段 passwordHash
export const UserVoSchema = createSelectSchema(users).omit({
  passwordHash: true,
  refreshToken: true,
});

export class UserVo extends createZodDto(UserVoSchema) {}
export type UserVoType = z.infer<typeof UserVoSchema>;
