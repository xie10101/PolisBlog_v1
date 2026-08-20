import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { QueryPostDto } from "./dto/query-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostService } from "./post.service";

// 这个类型的扩展是否符合规范？？ 
interface AuthenticatedRequest extends Request {
  user: { id: string; role: string; username?: string };
}

@Controller("dashboard/posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() dto: CreatePostDto, @Req() req: AuthenticatedRequest) {
    return this.postService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Put(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }

  @Post(":id/restore")
  restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.restore(id);
  }

  @Delete(":id/destroy")
  destroy(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.destroy(id);
  }
}
