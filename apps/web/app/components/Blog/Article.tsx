'use client';
import '@/app/reset.css';
import { MetaItem } from '@/app/(frontend)/types/meta';
import PostTips from './PostTips';
type ArticleProp = {
  slug: string;
  meta: MetaItem | null;
  htmlContent: string | '';
};

export default function Article(prop: ArticleProp) {
  const { slug, meta, htmlContent } = prop;
  console.log(slug);
  return (
    <article
      key={prop.slug}
      className="flex flex-col items-center justify-center p-12"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1> {meta === null ? '无标题' : meta.title}</h1>

        <PostTips meta={meta} />
        <div
          className="lg:w-2/3 md:w-2/3"
          dangerouslySetInnerHTML={{ __html: prop.htmlContent }}
        />
      </div>
    </article>
  );
}
