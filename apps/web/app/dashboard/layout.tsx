import { SidebarBlog } from '@/app/ui/dashboard/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { User } from '../ui/dashboard/user';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, AlignLeftIcon } from 'lucide-react';

/**
 * 概览页面布局组件
 *
 * 提供包含侧边栏和主内容区域的布局结构，适用于仪表盘或概览类页面。
 * 左侧为固定宽度的博客侧边栏（包含用户信息），右侧为可滚动的主内容区域。
 *
 * @param children - 要在主内容区域中渲染的子组件
 *
 * @returns 包含侧边栏和主内容区域的布局结构
 */
export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider className="w-[250px]">
        <SidebarBlog>
          <User></User>
        </SidebarBlog>
      </SidebarProvider>
      {/*  隐藏滚动条 */}
      <main className="no-scrollbar flex-1 flex-col overflow-y-auto bg-[#fafafa]">
        <main className="m-2 h-full items-center justify-center rounded-xl bg-white shadow-lg">
          <header className="mb-6 flex flex-row items-center justify-between border-b-1 p-4">
            {/* 使用奇怪各自模型- border ， padding 置于宽度中 便于处理   */}
            <Button variant="outline" className="fl">
              <AlignLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex flex-1 flex-row items-center justify-end gap-2">
              <Button>
                <Heart className="h-4 w-4" />
              </Button>
              <Button>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <div className="p-4">{children}</div>
        </main>
      </main>
    </>
  );
}
