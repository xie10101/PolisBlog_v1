import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const drafts = [
  {
    id: '1',
    title: '黑白主题博客草稿展示',
    excerpt: '这里展示草稿标题、更新时间和简短预览，UI 样式以黑白为主。',
    updated: '2026-05-18',
    category: '技术',
  },
  {
    id: '2',
    title: '下一次文章计划',
    excerpt: '继续完善博客文章编辑页面，保留草稿内容以便后续编辑。',
    updated: '2026-05-16',
    category: '设计',
  },
  {
    id: '3',
    title: 'UI 组件重构思路',
    excerpt: '整理 shadcn-ui 组件风格并统一页面样式。',
    updated: '2026-05-14',
    category: '前端',
  },
];

function Drafts() {
  return (
    <div className="flex min-h-full w-full flex-col gap-6 text-slate-950">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">草稿箱</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            以下为草稿列表 UI 展示，仅负责视觉组织，具体数据逻辑后续补充。
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 pt-3 sm:justify-end">
          <Button variant="outline" size="sm">
            新建草稿
          </Button>
        </div>
      </header>

      <Card className="border border-slate-200 bg-white text-slate-950 shadow-sm">
        <CardHeader className="gap-2">
          <div>
            <CardTitle>草稿列表</CardTitle>
            <CardDescription>
              预览当前草稿标题、分类、更新时间，以及简短摘录。
            </CardDescription>
          </div>
          <CardAction>
            <Button variant="ghost" size="sm">
              全部查看
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 pt-0">
          <Table className="min-w-full border-t border-slate-200">
            <TableCaption>
              仅展示草稿列表 UI，不包含实际请求和数据处理逻辑。
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="pr-6 text-right">预览</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map(draft => (
                <TableRow key={draft.id}>
                  <TableCell className="py-4 pr-2 pl-6 align-top font-medium">
                    {draft.title}
                  </TableCell>
                  <TableCell className="px-2 py-4 align-top text-slate-600">
                    {draft.category}
                  </TableCell>
                  <TableCell className="px-2 py-4 align-top text-slate-600">
                    {draft.updated}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right align-top text-slate-600">
                    {draft.excerpt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-3 text-right text-sm text-slate-500"
                >
                  共 {drafts.length} 条草稿
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Drafts;
