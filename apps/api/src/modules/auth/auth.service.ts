import { Injectable } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { BizCode } from "../../common/constants/business-code";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Inject } from "@nestjs/common";
import { users } from "../../db/schema/user.schema";
import { eq } from "drizzle-orm";
import { DRIZZLE_DB } from "../../db/drizzle.provider";
import * as schema from "../../db/schema/index";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** 登录校验密码，local strategy调用 */
  async validateUser(username: string, password: string) {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    if (!user) return null;
    //比对校验加密后hash串
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;
    return user;
  }

  /** 登录，签发 access + refresh，refresh存入数据库 */
  async login(userId: string, role: string) {
    // 生成 accessToken
    const accessToken = this.jwtService.sign({ sub: userId, role });

    // 生成 refreshToken，使用独立secret
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
      },
    );

    // 将refreshToken存入数据库（覆盖旧的，简单实现单设备登录；想要多设备则新建独立session表）
    await this.db.update(users).set({ refreshToken }).where(eq(users.id, userId));

    return { accessToken, refreshToken };
  }

  /** 使用refreshToken刷新accessToken */
  async refreshToken(refreshToken: string) {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch (e) {
      throw new BusinessException(BizCode.TOKEN_INVALID);
    }

    const userId = payload.sub as string;
    // 查询数据库，核对该用户存储的refreshToken是否一致（关键！实现可撤销）
    const [user] = await this.db.select().from(users).where(eq(users.id, userId));

    if (!user || user.refreshToken !== refreshToken) {
      throw new BusinessException(BizCode.TOKEN_REVOKED);
    }

    // 颁发新accessToken，refreshToken可以复用，也可以轮换重发
    const newAccessToken = this.jwtService.sign({ sub: user.id, role: user.role });
    return { accessToken: newAccessToken };
  }

  /** 登出：清空数据库refreshToken，直接失效 */
  async logout(userId: string) {
    await this.db.update(users).set({ refreshToken: null }).where(eq(users.id, userId));
    return true;
  }
}
