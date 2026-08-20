import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { users } from "../../../db/schema/user.schema";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../db/schema";
import { Injectable, Inject } from "@nestjs/common";
import { BusinessException } from "../../../common/exceptions/business.exception";
import { BizCode } from "../../../common/constants/business-code";
import { DRIZZLE_DB } from "../../../db/drizzle.provider";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    @Inject(DRIZZLE_DB) private readonly db: NodePgDatabase<typeof schema>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET")!,
    });
  }
  //校验失败是 ：

  // jwt校验通过后执行；payload是签发时传入内容
  // 查库确认用户仍存在 仍然返回 401 
  async validate(payload: { sub: string; role: string }) {
    // sub = userId
    const [user] = await this.db
      .select({ id: users.id, username: users.username, role: users.role })
      .from(users)
      .where(eq(users.id, payload.sub));

    if (!user) throw new BusinessException(BizCode.USER_NOT_FOUND);
    return user; // 挂载 req.user = {id,username,role}
  }
}
