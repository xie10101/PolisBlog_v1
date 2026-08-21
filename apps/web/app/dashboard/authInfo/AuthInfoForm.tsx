'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  blogInfoSchema,
  type BlogInfoFormData,
} from '@/modules/authorInfo/authorInfo.schema.validation';
import { Button } from '@/components/ui/button';

export function AuthInfoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BlogInfoFormData>({
    resolver: zodResolver(blogInfoSchema),
    defaultValues: {
      siteName: '',
      siteDesc: '',
      authorName: '',
      authorIntro: '',
      github: '',
      gitee: '',
      wechat: '',
      qq: '',
      backgroundImg: '',
    },
  });

  useEffect(() => {
    const fetchBlogInfo = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('/api/blog/info');
        const result = await response.json();

        if (result.success && result.data) {
          reset(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch blog info:', error);
        toast.error('获取个人信息失败');
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlogInfo();
  }, [reset]);

  const onSubmit = async (data: BlogInfoFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blog/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('个人信息已保存');
        reset(result.data);
      } else {
        toast.error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('Failed to save blog info:', error);
      toast.error('保存个人信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="py-8 text-center">加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* 网站名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            网站名称
          </label>
          <input
            type="text"
            {...register('siteName')}
            placeholder="输入网站名称"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.siteName && (
            <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
          )}
        </div>

        {/* 作者名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            作者名称
          </label>
          <input
            type="text"
            {...register('authorName')}
            placeholder="输入作者名称"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.authorName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.authorName.message}
            </p>
          )}
        </div>

        {/* 网站描述 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            网站描述
          </label>
          <textarea
            {...register('siteDesc')}
            placeholder="输入网站描述"
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.siteDesc && (
            <p className="mt-1 text-sm text-red-600">{errors.siteDesc.message}</p>
          )}
        </div>

        {/* 作者介绍 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            作者介绍
          </label>
          <textarea
            {...register('authorIntro')}
            placeholder="输入作者介绍"
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.authorIntro && (
            <p className="mt-1 text-sm text-red-600">
              {errors.authorIntro.message}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GitHub
          </label>
          <input
            type="url"
            {...register('github')}
            placeholder="https://github.com/username"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.github && (
            <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
          )}
        </div>

        {/* Gitee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gitee
          </label>
          <input
            type="url"
            {...register('gitee')}
            placeholder="https://gitee.com/username"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.gitee && (
            <p className="mt-1 text-sm text-red-600">{errors.gitee.message}</p>
          )}
        </div>

        {/* 微信 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            微信号
          </label>
          <input
            type="text"
            {...register('wechat')}
            placeholder="输入微信号"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.wechat && (
            <p className="mt-1 text-sm text-red-600">{errors.wechat.message}</p>
          )}
        </div>

        {/* QQ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            QQ
          </label>
          <input
            type="text"
            {...register('qq')}
            placeholder="输入QQ号"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.qq && (
            <p className="mt-1 text-sm text-red-600">{errors.qq.message}</p>
          )}
        </div>

        {/* 背景图片 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            背景图片URL
          </label>
          <input
            type="url"
            {...register('backgroundImg')}
            placeholder="输入背景图片URL"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.backgroundImg && (
            <p className="mt-1 text-sm text-red-600">
              {errors.backgroundImg.message}
            </p>
          )}
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !isDirty}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? '保存中...' : '保存'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={!isDirty}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
