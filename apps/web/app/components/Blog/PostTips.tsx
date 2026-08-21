'use client';
import { MetaItem } from '@/app/(frontend)/types/meta';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faEye,
  faFileWord,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
export default function PostTips(props: {
  meta: MetaItem | null;
  className?: string;
}) {
  if (props.meta == null) {
    return null;
  }

  return (
    <div
      className={clsx(
        'mb-4 w-full rounded-2xl bg-gray-100 p-4 text-sm text-slate-700 shadow-sm md:w-3/5 lg:w-1/2',
        'sm:flex sm:items-center sm:gap-2',
        props.className,
      )}
    >
      <div className="m-0 flex h-10 items-center gap-6">
        <p className="h-5 gap-2 text-slate-600">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>发表于：{props.meta.publishedAt || '无时间'}</span>
        </p>
        <p className="h-5 text-slate-600">
          <FontAwesomeIcon icon={faEye} />
          <span> </span> 阅读次数：{props.meta.viewCount ?? 0}
        </p>
      </div>

      <div className="mt-3 flex h-full flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex h-full items-center gap-2 text-slate-600">
          <FontAwesomeIcon icon={faFileWord} />
          <span>本文字数：{props.meta.wordCount ?? 0}字</span>
        </p>
        <p className="flex items-center gap-2 text-slate-600">
          <FontAwesomeIcon icon={faClock} />
          <span>阅读时长：{props.meta.readTime ?? '未知'}分钟</span>
        </p>
      </div>
    </div>
  );
}
