import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export class RefreshDto extends createZodDto(refreshSchema) {}
