# PolisBlog 迁移流程

从「单体 Next.js 16 全栈应用」迁移到「pnpm monorepo（Next 前端 + Nest 后端 + langchainjs Agent）」的完整流程。

> 核心原则：**增量迁移、契约先行、竖切优先、每步可验证**。不做一次性大爆炸式重写。

---

## Phase 0 — 基线锁定（前置）

**目标**：先把「现状」摸清并固化，否则后面每一步都无从对齐。

1. 提交当前 monorepo 骨架（首次 commit）。
2. **确认源项目代码位置**，纳入版本控制 / 可被读取。 ⚠️ 当前 `PolisBlog_v1` 里还没有源项目代码，这是最先要解决的阻塞项。
3. 跑一遍现有系统，建立**现状清单**：
   - 所有页面路由（App Router）
   - 所有 Server Actions / API Routes（重点：`actionHandler` / `apiHandler` 的实际签名与返回结构）
   - 数据模型与字段（User / Post / Tag / 认证相关）
   - 环境变量、依赖、数据库/存储现状
4. 输出一份「迁移对照表」：旧实现 → 新位置（shared 类型 / Nest 模块 / web 页面）。

**验收**：有一张能指导后续拆分的对照表；旧系统行为已被记录，可以随时比对。

---

## Phase 1 — 契约与地基（shared + Nest 统一响应）

**目标**：先把「统一响应处理」这一主题落到新架构里，成为所有后续模块的地基。

1. 盘点 `feat/responsehandle` 里 `actionHandler`/`apiHandler` 的响应结构，固化进 `packages/shared` 的 `ApiResponse<T>`（已占位）。
2. 把源项目的共享类型 / DTO 迁进 `packages/shared`。
3. 在 `apps/api` 建立统一响应基础设施：
   - `TransformInterceptor` —— 把所有 controller 返回值统一包装成 `ApiResponse<T>`
   - `HttpExceptionFilter` / 全局异常过滤器 —— 统一错误码与错误消息
   - `ValidationPipe` —— 统一入参校验（配 `class-validator` / `class-transformer`）
4. 打通 dev 工作流：`pnpm dev` 全链路（web ↔ api ↔ shared/agent）可热更新。

**验收**：Nest 任意接口默认返回 `ApiResponse` 结构，错误码一致；`pnpm dev` 全链路可跑。

---

## Phase 2 — 认证模块（纵向打通第一个，竖切样板）

**目标**：用最小的完整切片验证「shared 类型 → Nest 模块 → web 页面」的整套协作方式。

1. 决定认证方案（JWT 或 session；个人博客推荐 JWT + `@nestjs/jwt` + `@nestjs/passport`）。
2. `shared`：`User` 类型、登录/注册 DTO。
3. `api`：auth 模块（注册/登录/签发 token/守卫/策略）。
4. `web`：登录页、token 存储、请求拦截器、路由鉴权（middleware）。
5. 全链路联调。

**验收**：能注册/登录、拿到 token、受保护路由与接口鉴权生效。这一步跑通后，后续模块照此模式复制即可。

---

## Phase 3 — 数据层

**目标**：定下持久化方案，避免后续返工。

1. 选型 ORM + 数据库：推荐 **Drizzle + Postgres/SQLite**（类型安全、轻量）或 **Prisma + Postgres**。
2. 定义 schema：`user` / `post` / `tag` / `post_tag` 等。
3. `api` 接入数据层（Module + Repository/DAO 分层），提供迁移脚本与 seed。
4. 确认 `shared` 类型与 schema 的映射关系（类型单一来源）。

**验收**：数据库可迁移、可 seed；Nest 能读写数据。

---

## Phase 4 — 博客核心模块（竖切，逐子模块推进）

按依赖顺序，每个子模块都走「shared 类型 → Nest 模块 → web 页面」的完整闭环：

1. **文章（Post）**：列表 / 详情 / 创建 / 更新 / 删除（CRUD）。
2. **Markdown 编辑与渲染**：编辑侧（前端编辑器）+ 渲染侧（后端存储原文，前端渲染，或服务端渲染）。
3. **标签 / 分类**。
4. 每个子模块迁移完即验收，不堆积。

**验收**：前台能看文章、后台能增删改查、Markdown 正常渲染。

---

## Phase 5 — 管理后台（Dashboard）

1. 迁移后台仪表盘页面，复用 Phase 4 已迁移的 API（数据统计、文章管理、标签管理等）。
2. 补齐权限控制（`admin` / `editor` 角色）。

**验收**：后台功能与旧系统对等。

---

## Phase 6 — 知识库问答 Agent（新增能力）

**目标**：这是重构的新增价值点，放在博客数据入库之后。

1. 知识来源入库：把文章正文作为知识库数据源。
2. `packages/agent` 落地链路：文档加载 → 文本分块 → Embedding → 向量库检索 → 检索结果注入上下文 → LLM 生成。
3. `api` 暴露 `POST /api/agent/ask`（走统一 `ApiResponse` 响应）。
4. `web` 接入问答 UI。

**验收**：能基于博客内容回答问题，答案带来源引用。

---

## Phase 7 — 收尾

1. 测试：单元测试（`@nestjs/testing`、Vitest）+ 关键链路 e2e。
2. CI / 部署（monorepo 按包构建缓存）。
3. 删除旧的 Next 内嵌后端逻辑（Server Actions / API Routes）——确认新后端完全替代后再删。
4. 文档与 README 更新。

---

## 贯穿全程的决策点

- **响应处理层（Phase 1）是地基**，先做对，后续模块不重复造轮子。
- **竖切 > 横切**：每阶段保证系统「端到端可运行」，而不是「先做完所有后端再补前端」。
- **类型单一来源**：领域类型放 `packages/shared`，Nest 与 Next 都从那里引用，避免双份漂移。
- **每阶段有验收标准**：`pnpm build` 通过 + 目标功能可手工验证，才进入下一阶段。

## 当前阻塞项

- [ ] **源项目代码位置未定** —— 需要先把旧 Next.js 项目代码放入/接入本仓库，才能开始 Phase 0 的盘点。
