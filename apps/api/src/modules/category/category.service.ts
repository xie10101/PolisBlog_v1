import { Inject, Injectable } from "@nestjs/common";
import { and, asc, count, desc, eq, ne } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BizCode } from "../../common/constants/business-code";
import { BusinessException } from "../../common/exceptions/business.exception";
import { DRIZZLE_DB } from "../../db/drizzle.provider";
import { categories } from "../../db/schema/category.schema";
import * as schema from "../../db/schema";
import { CreateCategoryDtoType } from "./dto/create-category.dto";
import { QueryCategoryDtoType } from "./dto/query-category.dto";
import { UpdateCategoryDtoType } from "./dto/update-category.dto";
import { CategoryVoType } from "./dto/category.vo";

type CategoryRow = typeof categories.$inferSelect;

@Injectable()
export class CategoryService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * 新增分类
   * @param dto
   * @returns
   */
  async create(dto: CreateCategoryDtoType) {
    await this.ensureNameUnique(dto.name);
    await this.ensureSlugUnique(dto.slug);

    const [category] = await this.db
      .insert(categories)
      .values({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        status: dto.status,
        sortOrder: dto.sortOrder,
      })
      .returning();

    return this.toCategoryVo(category);
  }

  /**
   * 分页列表（含已软删除）
   */
  async findAll(query: QueryCategoryDtoType) {
    const page = query.page;
    const pageSize = query.pageSize;

    const [list, totalResult] = await Promise.all([
      this.db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder), desc(categories.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ total: count() }).from(categories),
    ]);

    return {
      list: list.map((item) => this.toCategoryVo(item)),
      total: totalResult[0]?.total ?? 0,
      page,
      pageSize,
    };
  }

  /**
   * 单条分类
   */
  async findOne(id: string) {
    const category = await this.getCategoryOrThrow(id);
    return this.toCategoryVo(category);
  }

  /**
   * 更新分类
   */
  async update(id: string, dto: UpdateCategoryDtoType) {
    await this.getCategoryOrThrow(id);

    if (dto.name) {
      await this.ensureNameUnique(dto.name, id);
    }
    if (dto.slug) {
      await this.ensureSlugUnique(dto.slug, id);
    }

    const [category] = await this.db
      .update(categories)
      .set({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        status: dto.status,
        sortOrder: dto.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return this.toCategoryVo(category);
  }

  /**
   * 软删除分类 - 只做软删除？？ 
   */
  async remove(id: string) {
    const category = await this.getCategoryOrThrow(id);
    if (category.deletedAt) {
      throw new BusinessException(BizCode.CATEGORY_ALREADY_DELETED);
    }

    const [deletedCategory] = await this.db
      .update(categories)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return this.toCategoryVo(deletedCategory);
  }

  private async getCategoryOrThrow(id: string) {
    const [category] = await this.db.select().from(categories).where(eq(categories.id, id));
    if (!category) {
      throw new BusinessException(BizCode.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  private async ensureNameUnique(name: string, excludeId?: string) {
    const where = excludeId
      ? and(eq(categories.name, name), ne(categories.id, excludeId))
      : eq(categories.name, name);

    const [category] = await this.db.select({ id: categories.id }).from(categories).where(where);
    if (category) {
      throw new BusinessException(BizCode.CATEGORY_NAME_EXISTS);
    }
  }

  private async ensureSlugUnique(slug: string, excludeId?: string) {
    const where = excludeId
      ? and(eq(categories.slug, slug), ne(categories.id, excludeId))
      : eq(categories.slug, slug);

    const [category] = await this.db.select({ id: categories.id }).from(categories).where(where);
    if (category) {
      throw new BusinessException(BizCode.CATEGORY_SLUG_EXISTS);
    }
  }

  private toCategoryVo(category: CategoryRow): CategoryVoType {
    return { ...category };
  }
}
