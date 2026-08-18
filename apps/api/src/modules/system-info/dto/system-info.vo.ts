import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { systemInfo } from "../../../db/schema/system-info.schema";
import { z } from "zod";

// 返回给前端的站点全局信息对象
export const SystemInfoVoSchema = createSelectSchema(systemInfo);

export class SystemInfoVo extends createZodDto(SystemInfoVoSchema) {}
export type SystemInfoVoType = z.infer<typeof SystemInfoVoSchema>;
