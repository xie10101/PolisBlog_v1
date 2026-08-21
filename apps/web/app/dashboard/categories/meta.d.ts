import { Category } from '@/app/types/category'; // 你的分类类型

// 扩展 TanStack Table 的 meta 类型 需要
declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    onEdit: (row: TData) => void;
    onDelete: (row: TData) => void;
  }
}
