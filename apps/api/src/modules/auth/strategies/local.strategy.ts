import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { BusinessException } from "../../../common/exceptions/business.exception";
import { BizCode } from "../../../common/constants/business-code";
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
      throw new BusinessException(BizCode.INVALID_CREDENTIALS);
    }
    return user; // 返回值挂载到 req.user 
  }
}
