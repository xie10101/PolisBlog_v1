import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq, isNotNull, isNull, ne } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BizCode } from "../../common/constants/business-code";
import { BusinessException } from "../../common/exceptions/business.exception";
import { DRIZZLE_DB } from "../../db/drizzle.provider";
import { categories } from "../../db/schema/category.schema";
import { posts } from "../../db/schema/post.schema";
import * as schema from "../../db/schema";
import { CreatePostDtoType } from "./dto/create-post.dto";
import { QueryPostDtoType } from "./dto/query-post.dto";
import { UpdatePostDtoType } from "./dto/update-post.dto";
import { PostVoType } from "./dto/post.vo";

/**
 * trash 仅兼容源库历史数据，应用层已改用 deletedAt 表达删除
 *
 */
type DbPostStatus = "draft" | "pending" | "published" | "trash";
type ApiPostStatus = "draft" | "published" | "scheduled" | "deleted";
type PostRow = typeof posts.$inferSelect;

@Injectable()
export class PostService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  /**
   * 新增文章
   * @param dto
   * @param authorId
   * @returns
   */
  async create(dto: CreatePostDtoType, authorId: string) {
    // 检查slug是否唯一
    await this.ensureSlugUnique(dto.slug);
    // 检查分类是否存在
    await this.ensureCategoryExists(dto.categoryId);

    const [post] = await this.db
      .insert(posts)
      .values({
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        htmlContent: dto.htmlContent,
        coverImage: dto.coverImage,
        status: this.toDbStatus(dto.status),
        isTop: dto.isTop,
        sortOrder: dto.sortOrder,
        publishedAt: dto.publishedAt,
        categoryId: dto.categoryId,
        authorId,
      })
      .returning();

    return this.toPostVo(post);
  }
  /**
   *  分页+状态查找
   * @param query
   * @returns
   */
  async findAll(query: QueryPostDtoType) {
    const where = this.buildListWhere(query.status);
    const page = query.page;
    const pageSize = query.pageSize;

    const [list, totalResult] = await Promise.all([
      this.db
        .select()
        .from(posts)
        .where(where)
        .orderBy(
          desc(posts.isTop),
          desc(posts.sortOrder),
          desc(posts.publishedAt),
          desc(posts.createdAt),
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ total: count() }).from(posts).where(where),
    ]);

    return {
      list: list.map((item) => this.toPostVo(item)),
      total: totalResult[0]?.total ?? 0,
      page,
      pageSize,
    };
  }

  /**
   *查找某文章
   * @param id  
   * @returns
   */
  async findOne(id: string) {
    const post = await this.getPostOrThrow(id);
    return this.toPostVo(post);
  }

  /**
   * 更新文章
   * @param id
   * @param dto
   * @returns
   */
  async update(id: string, dto: UpdatePostDtoType) {
    await this.getPostOrThrow(id);

    // 更新时保证要素稳定
    if (dto.slug) {
      await this.ensureSlugUnique(dto.slug, id);
    }

    if (dto.categoryId !== undefined) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    const [post] = await this.db
      .update(posts)
      .set({
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        htmlContent: dto.htmlContent,
        coverImage: dto.coverImage,
        status: dto.status ? this.toDbStatus(dto.status) : undefined,
        isTop: dto.isTop,
        sortOrder: dto.sortOrder,
        publishedAt: dto.publishedAt,
        categoryId: dto.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return this.toPostVo(post);
  }

  /**
   * 软删除
   * @param id
   * @returns
   */
  async remove(id: string) {
    const post = await this.getPostOrThrow(id);
    if (post.deletedAt) {
      throw new BusinessException(BizCode.POST_ALREADY_DELETED);
    }

    const [deletedPost] = await this.db
      .update(posts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return this.toPostVo(deletedPost);
  }
  /**
   * 恢复软删除
   * @param id
   * @returns
   */
  async restore(id: string) {
    const post = await this.getPostOrThrow(id);
    if (!post.deletedAt) {
      throw new BusinessException(BizCode.POST_NOT_DELETED);
    }

    const [restoredPost] = await this.db
      .update(posts)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return this.toPostVo(restoredPost);
  }
  /**
   * 彻底删除
   * @param id
   * @returns
   */
  async destroy(id: string) {
    await this.getPostOrThrow(id);
    const [deletedPost] = await this.db.delete(posts).where(eq(posts.id, id)).returning();
    return this.toPostVo(deletedPost);
  }

  /**
   * 构建文章列表的查询条件
   * @param status 文章状态，可选参数
   * @returns 返回查询条件，可能是undefined或具体的查询条件
   */
  private buildListWhere(status?: ApiPostStatus) {
    // 如果没有指定状态，则不添加任何过滤条件
    if (!status) {
      return undefined;
    }
    //状态为"deleted"时，只返回已删除的文章-存在 deletedAt字段
    if (status === "deleted") {
      return isNotNull(posts.deletedAt);
    }
    //状态为已设置的其他状态时，只返回未删除的文章-不存在 deletedAt字段
    const dbStatus = this.toDbStatus(status);
    if (!dbStatus) {
      return isNull(posts.deletedAt);
    }
    //状态匹配+删除字段为空
    return and(isNull(posts.deletedAt), eq(posts.status, dbStatus));
  }

  //获取文章
  private async getPostOrThrow(id: string) {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      throw new BusinessException(BizCode.POST_NOT_FOUND);
    }
    return post;
  }

  // 确保slug唯一
  private async ensureSlugUnique(slug: string, excludeId?: string) {
    const where = excludeId
      ? and(eq(posts.slug, slug), ne(posts.id, excludeId))
      : eq(posts.slug, slug);

    const [post] = await this.db.select({ id: posts.id }).from(posts).where(where);
    if (post) {
      throw new BusinessException(BizCode.POST_SLUG_EXISTS);
    }
  }

  // 确保分类存在
  private async ensureCategoryExists(categoryId?: string | null) {
    if (!categoryId) {
      return;
    }

    const [category] = await this.db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, categoryId), isNull(categories.deletedAt)));

    if (!category) {
      throw new BusinessException(BizCode.CATEGORY_NOT_FOUND);
    }
  }

  /**
   * 将API文章状态转换为数据库文章状态
   * @param status - 可选参数，排除"deleted"的API文章状态
   * @returns 转换后的数据库文章状态或undefined
   */
  private toDbStatus(status?: Exclude<ApiPostStatus, "deleted">): DbPostStatus | undefined {
    if (!status) {
      return undefined;
    }

    const statusMap: Record<Exclude<ApiPostStatus, "deleted">, DbPostStatus> = {
      draft: "draft",
      published: "published",
      scheduled: "pending",
    };

    return statusMap[status];
  }

  /**
   * 将数据库帖子状态转换为API接口所需的帖子状态
   * @param post - 包含帖子信息的PostRow对象
   * @returns 返回转换后的ApiPostStatus状态值
   */
  private toApiStatus(post: PostRow): ApiPostStatus {
    if (post.deletedAt) {
      return "deleted";
    }

    const statusMap: Record<DbPostStatus, ApiPostStatus> = {
      draft: "draft",
      pending: "scheduled",
      published: "published",
      trash: "deleted",
    };

    return statusMap[post.status ?? "draft"];
  }

  /**
   * 将PostRow对象转换为PostVoType对象
   * @param post - 需要转换的PostRow对象
   * @returns 转换后的PostVoType对象，包含原始属性和转换后的状态
   */
  private toPostVo(post: PostRow): PostVoType {
    return {
      ...post, // 展开原始post对象的所有属性
      status: this.toApiStatus(post), // 调用toApiStatus方法转换状态属性
    };
  }
}

/**
 * 此处APIPostStatus是API接口所需的帖子状态
 *  与前端一直 - 可以放到共享包中
 *
 */
