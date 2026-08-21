type Tag = string;

// 内容条目（核心对象结构） - 文章
export interface MetaItem {
  /** 标题 */
  title: string;
  /** 创建时间 格式化的日期字符串，例如：2025-10-13） */
  publishedAt: string;
  /** 分类 */
  categoryId?: string | null;
  /** 字数（正整数） */
  wordCount: number | null;
  /** 阅读次数（非负整数） */
  viewCount: number | null;
  // /** 阅读时长（秒，非负整数） */
  // readDuration: number; // 单位：秒
  /** 标签（可多个） */
  tags?: Tag[];
  /** 内容摘要（可选） */
  excerpt?: string | null;
  /** 封面图片URL（可选） */
  coverImage?: string | null;
  readTime?: number | null; // 阅读时长（秒，非负整数）
  isTop?: boolean | null; // 是否置顶
  sortOrder?: number | null; // 排序字段，数值越大优先展示
  authorId?: string | null; // 作者ID
  id: string; // 文章ID
}
/**
 *  不能将类型“{ slug: string; meta: 
 * { publishedAt: string; title: string; id: string; excerpt: string | null;
 *  coverImage: string | null; viewCount: number | null; wordCount: number | null; 
 * readTime: number | null; isTop: boolean | null; sortOrder: number | null; authorId: string; 
 * categoryId: string | null; }; }
 * ”分配给类型“{ slug: string; meta: MetaItem; }”。
 */
