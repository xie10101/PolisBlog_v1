// 侧边栏- dashboard-layout组件
'use client';
import { Sidebar } from '@/components/ui/sidebar';
// 使用 provider
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
// 组件应该是分割的 - 相互嵌套可能不是最好实践
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';
// next 中 Link组件的使用
import Link from 'next/link';

export function SidebarBlog({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  // 折叠相关的动态设置- 可控 设置
  // const { open, setOpen } = useSidebar();   // 已经设置的数据
  // console.log(open)
  // useEffect(() => {  // 监听数据变化
  //   console.log(open)
  //   setOpen(!open)
  // }, [])

  const projects = [
    { name: '仪表盘', url: '/dashboard' },
    { name: '文章管理', url: '/dashboard/articles' }, 
    { name: '草稿箱', url: '/dashboard/drafts' },
    { name: '文章编辑器', url: '/dashboard/post_editor' }, 
    { name: '分类管理', url: '/dashboard/categories' },
    {name: "作者信息",url:"/dashboard/authInfo"}
  ];
  const pathname = usePathname();
  return (
    <>
      {/* 样式设置 - 左侧 - 内嵌 - 可折叠  */}
      <Sidebar side="left" variant="inset" collapsible="offcanvas">
        <SidebarInset>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-bold">
                  Blog Managment
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map(project => (
                    <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={project.url === pathname}
                      >
                        <Link href={project.url}>
                          <span>{project.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/*  折叠菜单组 */}
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>Help</CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {projects.map(project => (
                        <SidebarMenuItem key={project.name}>
                          <SidebarMenuButton asChild>
                            <a href={project.url}>
                              <span>{project.name}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
          <SidebarFooter >
            {/* 设置一个按钮 - 可以是 用户信息部分  */}
            <SidebarMenu>
              <SidebarMenuItem >
                <SidebarMenuButton>{children}</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarInset>
      </Sidebar>
    </>
  );
}
