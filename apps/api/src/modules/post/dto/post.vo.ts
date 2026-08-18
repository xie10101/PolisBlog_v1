import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "nestjs-zod";
import { posts } from "../../../db/schema/post.schema";
import { z } from "zod";

// 返回给前端的文章对象（完整字段）
export const PostVoSchema = createSelectSchema(posts);

export class PostVo extends createZodDto(PostVoSchema) {}
export type PostVoType = z.infer<typeof PostVoSchema>;
