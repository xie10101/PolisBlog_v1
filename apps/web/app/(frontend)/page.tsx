'use client';
import Brief from '@/app/components/Blog/brief';
import Pagination from '@/app/components/pagination';
import { MetaItem } from '@/app/(frontend)/types/meta';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { fetchPostsByPage } from '../../modules/post/post.actions';
import { toast } from 'sonner';
// import { Post } from '../../modules/post/post.schema';
export default function PageList() {
  const searchParams = useSearchParams();
  const [totalNum, setTotalNum] = useState(1);
  const [posts, setPosts] = useState<{ slug: string; meta: MetaItem }[]>([]);
  // ✅ 新增：把当前页码变成状态，避免渲染时直接使用 searchParams
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const postlist = searchParams.get('postlit');
    setCurrentPage(postlist ? parseInt(postlist) : 1);
    // async function fetchData() {
    //   const res = await fetchPostsByPage(1, 15);
    //   if (res.success && res.data) {
    //     //  对获取到的数据进行字段转换处理
    //     const { data, total } = res.data;
    //     const formattedPosts = data.map((post: Post) => {
    //       const {
    //         content,
    //         htmlContent,
    //         status,
    //         slug,
    //         updatedAt,
    //         deletedAt,
    //         createdAt,
    //         ...meta
    //       } = post;
    //       return {
    //         slug: post.slug,
    //         // meta 是指文章除去 主要内容 content ， contentHtml , slug ， status ……  以外的字段
    //         meta: {
    //           ...meta,
    //           publishedAt: post.publishedAt?.toISOString() || '',
    //         },
    //       };
    //     });
    //     setPosts(formattedPosts);
    //     setTotalNum(total);
    //     toast.success('获取文章列表成功');
    //   } else {
    //     toast.error('获取文章列表失败');
    //   }
    // }
    // fetchData();
  }, [searchParams]);

  return (
    <section className="overflow-y-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">博客列表</h1>
      {/* <hr /> */}
      <div className="prose prose-gray flex max-w-none flex-col items-center justify-center">
        {/*  标签样式被默认样式覆盖  */}
        {posts
          .filter(post => post !== null)
          .map(post => (
            <Brief key={post.slug} slug={post.slug} meta={post.meta} />
          ))}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalNum / 15)}
        />
      </div>
    </section>
  );
}
