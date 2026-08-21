'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPost } from '@/modules/post/post.actions';
import { getActiveCategories } from '@/modules/category/category.actions';
import useUserInfoStore from '@/store/user';
import {
  CreateFormDto,
  CreateFormtSchema,
} from '@/modules/post/dto/newpost-create.dto';
import { toast } from 'sonner';

// 组件懒加载和渲染方式的设置
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Markdown 预览组件 - 内部会转换为 HTML
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
  loading: () => <div className="p-4 text-gray-500">Loading preview...</div>,
});

export default function PostEditorPage() {
  const [content, setContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const id = useUserInfoStore(state => state.id);
  const {
    register,
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
  } = useForm<CreateFormDto>({
    defaultValues: {
      title: '',
      coverImage:
        'https://raw.githubusercontent.com/xie10101/IMG-_Bed/main/imgs/20260315233353402.jpg',
      excerpt: '',
      categoryId: '',
    },
    resolver: zodResolver(CreateFormtSchema),
  });

  // 获取分类数据
  useEffect(() => {
    async function fetchCategories() {
      const res = await getActiveCategories();
      if (res.success && res.data) {
        setCategories(res.data as any);
      } else {
        toast.error('获取分类失败');
      }
    }
    fetchCategories();
  }, []);

  // 编辑器主题的设置
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'light');
  }, []);

  // 处理内容变化 - 同时更新原始 markdown 和 html 内容
  const handleContentChange = (value: string | undefined) => {
    const md = value || '';
    setContent(md);
  };

  // 生成 slug (从标题)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
    // 这段处理是对文章做 URL 友好标识生成
  };

  // 计算字数和阅读时间
  const calculateMetrics = (text: string) => {
    // 粗略计算：中文算一个字，英文单词算一个字
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
    const englishWords = text
      .replace(/[\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const wordCount = chineseChars.length + englishWords.length;
    // 假设阅读速度为 300 字/分钟
    const readTime = Math.ceil(wordCount / 300);

    return { wordCount, readTime };
  };

  const previewRef = useRef<HTMLDivElement>(null);

  async function handlePublish(data: CreateFormDto) {
    const contentHtml = extractInnerHtml(previewRef.current?.innerHTML || '');
    const slug = generateSlug(data.title || '');
    const { wordCount, readTime } = calculateMetrics(content);

    const postData = {
      ...data,
      content: content,
      htmlContent: contentHtml, // 修正字段名为 htmlContent
      slug,
      wordCount,
      readTime,
      publishedAt: new Date(),
      authorId: id as string,
      // 状态 置顶 排序
    };
    const res = await createPost(postData);
    if (res.success) {
      toast('发布成功');
      setIsDialogOpen(false);
    } else {
      toast.error(res.error as string);
      setError('root', { message: res.error as string });
    }
  }

  //  获取内部Html内容
  function extractInnerHtml(html: string): string {
    const match = html.match(/<div[^>]*>([\s\S]*?)<\/div>/);
    return match ? match[1] : html;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <Button variant="outline">
          <Link href="/dashboard/drafts">草稿箱</Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast('草稿已保存', { position: 'top-center' })}
          >
            保存草稿
          </Button>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            发布
          </Button>
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          height="100%"
          className="h-full"
          preview="edit"
        />
      </div>

      {/* 发布弹窗 */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={e => {
          setIsDialogOpen(false);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>发布文章</DialogTitle>
            <DialogDescription>填写文章信息并预览内容后发布</DialogDescription>
          </DialogHeader>
          <form>
            <div className="flex flex-col gap-4 py-4">
              {/* 标题 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">标题</label>
                <Input
                  id="title"
                  placeholder="输入文章标题"
                  {...register('title')}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>
              {/* 摘要 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">摘要</label>
                <Textarea
                  placeholder="输入文章摘要（可选）"
                  {...register('excerpt')}
                  rows={3}
                />
                {errors.excerpt && (
                  <span className="error-message">
                    {errors.excerpt.message}
                  </span>
                )}
              </div>
              {/* 分类 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">分类</label>
                <select
                  {...register('categoryId')}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="error-message">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>
              {/* 封面图 */}
              {/** 暂时未补充上传功能 先使用默认url 兜底 -提交  */}
              <div className="space-y-2">
                <label className="text-sm font-medium">封面图片 URL</label>
                {/*  此处处理存在问题 - url 可能无效- 最好是1. 可以判断该URL有效或者直接从图库中复制选择传递*/}
                <Input
                  placeholder="输入封面图片地址（可选）"
                  {...register('coverImage')}
                />
                {errors.coverImage && (
                  <span className="error-message">
                    {errors.coverImage.message}
                  </span>
                )}
              </div>
              {/* 统计信息预览 */}
              <div className="flex gap-4 text-sm text-gray-500">
                <span>预计字数：{calculateMetrics(content).wordCount} 字</span>
                <span>
                  预计阅读时间：{calculateMetrics(content).readTime} 分钟
                </span>
              </div>
              {/* 内容预览 -- 该数据的处理1. 因为转换时内容逻辑执行的所以验证可以自定义处理  */}
              <div className="space-y-2">
                <label className="text-sm font-medium">内容预览</label>
                <div className="max-h-[300px] min-h-[200px] overflow-y-auto rounded-md border bg-gray-50 p-4">
                  {content ? (
                    <div ref={previewRef}>
                      <MarkdownPreview
                        source={content}
                        className="bg-transparent"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400">暂无内容</p>
                  )}
                </div>
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                handleSubmit(handlePublish)();
              }}
            >
              {isSubmitting ? '...发布中' : ' 确认发布'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
