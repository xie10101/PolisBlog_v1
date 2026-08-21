import { MetaItem } from '@/app/(frontend)/types/meta';
import Article from '@/app/components/Blog/Article';
import { Suspense } from 'react';
// import { fetchPostBySlug } from '@/modules/post/post.actions';
import { toast } from 'sonner';

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);
  let meta: MetaItem = {
    title: '',
    authorId: '',
    publishedAt: '',
    wordCount: 0,
    readTime: 0,
    viewCount: 0,
    id: '',
  };

  let html = '';
  // const res = await fetchPostBySlug(slug);
  if (res.success && res.data) {
    const {
      content,
      htmlContent,
      status,
      slug,
      updatedAt,
      deletedAt,
      createdAt,
      ...rest
    } = res.data;
    html = htmlContent || '';
    meta = {
      ...rest,
      publishedAt: res.data.publishedAt?.toISOString() || '',
    };
  }
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Article slug={slug} meta={meta} htmlContent={html} />
    </Suspense>
  );
}
