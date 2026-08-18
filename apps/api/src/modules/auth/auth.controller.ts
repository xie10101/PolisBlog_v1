import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(AuthGuard("local"))
  //它是一个通用守卫，本身不做校验，
  // 而是把工作委托给一个名字匹配的 Passport 策略：
  async login(@Body() _dto: LoginDto, @Req() req) {
    // local策略校验完成，req.user为数据库用户对象
    // @Req() 是 NestJS 用来注入原生请求对象的参数装饰器。
    const { id, role } = req.user;
    return this.authService.login(id, role);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  async logout(@Req() req) {
    await this.authService.logout(req.user.id);
    return { message: "登出成功" };
  }
}
