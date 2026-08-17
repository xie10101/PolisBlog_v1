# PolisBlog

全栈个人博客系统 + 个人知识库系统，基于 **pnpm workspace** 单仓（monorepo）架构。

## 技术栈

| 层 | 技术 | 目录 |
| --- | --- | --- |
| 前台 / 管理后台 UI | Next.js 16 (App Router) + React 19 | `apps/web` |
| REST API / 认证 / RAG 服务 | NestJS 11 | `apps/api` |
| 知识库问答 Agent | langchainjs | `packages/agent` |
| 共享类型 / 常量 | TypeScript | `packages/shared` |

## 目录结构

```
PolisBlog_v1
├── apps
│   ├── web                 # Next.js 16：前台展示 + Markdown 编辑 + 后台仪表盘
│   └── api                 # NestJS 11：REST API + 用户认证 + 知识库 RAG 服务
├── packages
│   ├── shared              # 跨端共享：类型、常量、ApiResponse 统一响应结构
│   └── agent               # langchainjs 知识库问答 Agent（占位，待实现）
├── pnpm-workspace.yaml     # workspace 声明
├── tsconfig.base.json      # 共享 TS 基础配置
└── package.json            # 根编排脚本
```

## 环境要求

- Node.js >= 22
- pnpm >= 9（推荐通过 `corepack enable` 使用 `packageManager` 声明的版本）

## 常用命令

```bash
pnpm install          # 安装全部依赖（含 workspace 链接）

pnpm build            # 构建 packages 再构建 apps（依赖顺序已保证）
pnpm build:packages   # 仅构建 shared + agent
pnpm build:apps       # 仅构建 web + api

pnpm dev              # 并行启动全部 workspace 的 dev（packages 为 tsup --watch）
pnpm dev:web          # 仅启动 Next 前端
pnpm dev:api          # 仅启动 Nest 后端

pnpm typecheck        # 全量类型检查（需先 build:packages 生成 dist 类型）
pnpm format           # Prettier 格式化
pnpm clean            # 清理各包的 dist / .next
```

## 端口约定

- 前端 `apps/web`：`3000`
- 后端 `apps/api`：`3001`（默认挂载 `/api` 全局前缀，`GET /api/health` 健康检查）

## 包依赖关系

```
apps/web   ──> @polisblog/shared
apps/api   ──> @polisblog/shared, @polisblog/agent
packages/agent ──> @polisblog/shared, langchain, @langchain/core, @langchain/openai
```

`shared` / `agent` 通过 tsup 构建为 **ESM + CJS 双格式**（含 `.d.ts`），因此 Next（ESM）与 Nest（CommonJS）均可直接消费；消费方类型解析依赖 `dist`，故 `build` / `typecheck` 前需先 `build:packages`。

## Roadmap（迁移计划）

1. ✅ monorepo 骨架 + 目录结构（本次）
2. ⬜ 迁移现有 `feat/responsehandle` 的 `actionHandler` / `apiHandler` 到 Nest 侧，统一响应处理
3. ⬜ 迁移博客模块（文章 CRUD、Markdown 渲染、标签、认证）到 `apps/api` + `apps/web`
4. ⬜ 实现 `packages/agent` 知识库问答链路（加载 → 分块 → Embedding → 检索 → 生成）
5. ⬜ 接入数据库（ORM 待定）与文件存储
