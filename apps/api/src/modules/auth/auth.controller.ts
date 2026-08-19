import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { IsPublic } from "./decorators/is-public.decorator";
import { AppLoggerService } from "src/common/logger/logger.service";
/**
 * 引入 Express 类型（auth.controller.ts:8）
定义 AuthenticatedRequest 接口，扩展 Request 并声明 user 字段形状（auth.controller.ts:10-12）
两处 @Req() req 都标注为 AuthenticatedRequest（auth.controller.ts:22、auth.controller.ts:36）
 */
import type { Request } from "express";

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string; username?: string };
}

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: AppLoggerService,
  ) {}
  @IsPublic()
  @Post("login")
  @UseGuards(AuthGuard("local"))
  //它是一个通用守卫，本身不做校验，
  // 而是把工作委托给一个名字匹配的 Passport 策略：
  async login(@Body() _dto: LoginDto, @Req() req: AuthenticatedRequest) {
    // local策略校验完成，req.user为数据库用户对象
    // @Req() 是 NestJS 用来注入原生请求对象的参数装饰器。
    this.logger.log("进行登录" + req.user.id);
    const { id, role } = req.user;
    return this.authService.login(id, role);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  async logout(@Req() req: AuthenticatedRequest) {
    await this.authService.logout(req.user.id);
    return { message: "登出成功" };
  }
}
