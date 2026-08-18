import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { users } from "../../../db/schema/user.schema";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../db/schema";
import { UnauthorizedException } from "@nestjs/common";
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    private readonly db: NodePgDatabase<typeof schema>,
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

    if (!user) throw new UnauthorizedException("用户不存在");
    return user; // 挂载 req.user = {id,username,role}
  }
}
