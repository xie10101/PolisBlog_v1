import { Injectable, Inject } from "@nestjs/common";
import { BusinessException } from "../../common/exceptions/business.exception";
import { BizCode } from "../../common/constants/business-code";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, ilike, and, count } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { DRIZZLE_DB } from "../../db/drizzle.provider";
import * as schema from "../../db/schema";
import { users } from "../../db/schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // 返回给前端的字段（剔除敏感字段 passwordHash / refreshToken）
  private readonly safeColumns = {
    id: users.id,
    username: users.username,
    email: users.email,
    avatar: users.avatar,
    bio: users.bio,
    role: users.role,
    status: users.status,
    lastLoginAt: users.lastLoginAt,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  };

  /** 注册：明文密码 bcrypt 后写入，role/status 走 DB 默认值 */
  async register(dto: CreateUserDto) {
    // 返回是数组对象 
    const [exist] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, dto.username));
    if (exist) throw new BusinessException(BizCode.USERNAME_EXISTS);

    if (dto.email) {
      const [emailExist] = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, dto.email));
      if (emailExist) throw new BusinessException(BizCode.EMAIL_EXISTS);
    }
    // 密码加密存储
    const passwordHash = await bcrypt.hash(dto.password, 10);
    //  直接使用接收到的参数DTO对象进行数据库sql操作 
    const [user] = await this.db
      .insert(users)
      .values({
        username: dto.username,
        passwordHash,
        email: dto.email,
        avatar: dto.avatar,
        bio: dto.bio,
      })
      .returning(this.safeColumns);
    return user;
  }

  /** 分页 + username / email 模糊查询 */
  async findAll(query: QueryUserDto) {
    const conditions = [
      query.username ? ilike(users.username, `%${query.username}%`) : undefined,
      query.email ? ilike(users.email, `%${query.email}%`) : undefined,
    ];
    const where = and(...conditions);

    const page = query.page;
    const pageSize = query.pageSize;

    const [list, totalResult] = await Promise.all([
      this.db
        .select(this.safeColumns)
        .from(users)
        .where(where)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ total: count() }).from(users).where(where),
    ]);

    return { list, total: totalResult[0]?.total ?? 0, page, pageSize };
  }

  /** 按 id 查询单个用户 */
  async findOne(id: string) {
    const [user] = await this.db.select(this.safeColumns).from(users).where(eq(users.id, id));
    if (!user) throw new BusinessException(BizCode.USER_NOT_FOUND);
    return user;
  }

  /** 更新：字段可选；password 若传入则 bcrypt 后更新 */
  async update(id: string, dto: UpdateUserDto) {
    const [exist] = await this.db.select({ id: users.id }).from(users).where(eq(users.id, id));
    if (!exist) throw new BusinessException(BizCode.USER_NOT_FOUND);

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

    const [user] = await this.db
      .update(users)
      .set({
        username: dto.username,
        email: dto.email,
        avatar: dto.avatar,
        bio: dto.bio,
        role: dto.role,
        status: dto.status,
        passwordHash,
      })
      .where(eq(users.id, id))
      .returning(this.safeColumns);
    return user;
  }

  /** 软删除：status 置为 inactive */
  async remove(id: string) {
    const [exist] = await this.db.select({ id: users.id }).from(users).where(eq(users.id, id));
    if (!exist) throw new BusinessException(BizCode.USER_NOT_FOUND);

    await this.db.update(users).set({ status: "inactive" }).where(eq(users.id, id));
    return { message: "删除成功" };
  }
}
