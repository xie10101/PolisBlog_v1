import { Module } from "@nestjs/common";
import { DbModule } from "../../db/db.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  imports: [DbModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
