// 内容简述组件
'use client';
import { MetaItem } from '@/app/(frontend)/types/meta';
import '@/app/reset.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Item,
  ItemSeparator,
  ItemFooter,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '../ui/item';
import Image from 'next/image';

function formatDate(value?: string | null) {
  if (!value) return '无时间';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '无时间';

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export default function Brief(props: { slug: string; meta?: MetaItem | null }) {
  const router = useRouter();
  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    router.push(`/${props.slug}`);
    // 在这里添加你的自定义逻辑，例如打开一个新的窗口或进行其他操作
  };
  return (
    <Item
      variant="outline"
      className="m-6 w-2xl border-0 hover:bg-[#f7f7f8]"
      asChild
      role="listitem"
    >
      <div className="flex flex-col gap-2">
        <div
          onClick={handleLinkClick}
          className="flex w-full cursor-pointer items-center gap-2"
        >
          <ItemMedia variant="image" className="h-32 w-32 rounded-2xl">
            <Image
              // props.meta?.coverImage
              src={'/images/1.png'}
              alt="博客项图片"
              width={128}
              height={128}
            />
          </ItemMedia>
          <ItemContent className="w-40">
            <ItemTitle className="line-clamp-1">
              <span className="text-muted-foreground text-lg font-bold">
                {' '}
                {props.meta?.title || '无标题'}{' '}
              </span>
            </ItemTitle>
            <ItemDescription>
              <span className="text-muted-foreground text-sm font-bold">
                {' '}
                {formatDate(props.meta?.publishedAt)}{' '}
              </span>
            </ItemDescription>
            <ItemDescription>
              <span className="text-muted-foreground text-sm font-bold">
                {props.meta?.excerpt || '无标签'}
              </span>
            </ItemDescription>
          </ItemContent>
        </div>
        <ItemFooter className="flex w-full items-center justify-between gap-2">
          <span> 作者：{props.meta?.authorId || '无作者'} </span>
          <Link
            href={`/${props.slug}`}
            className="text-sm text-[#202121] underline"
          >
            阅读更多
          </Link>
        </ItemFooter>
        <ItemSeparator />
      </div>
    </Item>
  );
}

/*

   
*/
