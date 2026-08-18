import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { systemInfo } from "../../../db/schema/system-info.schema";
import { z } from "zod";

const rawUpdateSchema = createInsertSchema(systemInfo, {
  skills: z.array(z.string()),
});

// 单例表：仅支持更新，所有字段可选；id / 时间戳由服务端托管
export const UpdateSystemInfoSchema = rawUpdateSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export class UpdateSystemInfoDto extends createZodDto(UpdateSystemInfoSchema) {}
export type UpdateSystemInfoDtoType = z.infer<typeof UpdateSystemInfoSchema>;
