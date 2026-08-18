import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "username" }); // dto字段名
    //**
    // usernameField: "username" 是告诉 passport：「去 req.body.username 里取用户名」 */
  }

  //  body数据读取
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("用户名或密码错误");
    }
    return user; // 返回值挂载到 req.user 
  }
}
