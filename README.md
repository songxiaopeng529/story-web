# story-web

一个面向长期演进的个人网站 Monorepo，用于展示个人简历、文章与作品。

当前访客站采用 Next.js、Tailwind CSS 和 Markdown/MDX；内容统一通过 GitHub 管理，自由画板使用 Excalidraw 文件承载。未来可以在同一仓库中增加管理后台以及 Go、Java 等独立后端服务，而无需重构现有 Web 应用边界。

## 仓库结构

```text
story-web/
├── apps/
│   └── web/          # 当前 Next.js 访客站
├── packages/         # 未来共享的 JS/TS 包
├── services/         # 未来 Go/Java 等独立后端服务
├── docs/             # 架构与项目文档
├── package.json      # Monorepo 根命令
├── pnpm-workspace.yaml
└── turbo.json
```

边界约定：

- `apps/` 存放可独立运行和部署的前端或 Node.js 应用。
- `packages/` 只存放不可独立部署的共享 JavaScript/TypeScript 代码。
- `services/` 存放未来使用原生工具链构建、独立部署的 Go/Java 服务。
- 跨语言通信通过 HTTP/RPC/事件和明确契约完成，不跨目录引用服务源码。

## 本地开发

要求 Node.js 22.18 或更高版本。仓库通过 Corepack 固定 pnpm 版本。

```shell
corepack pnpm install
corepack pnpm dev:web
```

打开 [http://localhost:3000](http://localhost:3000)。

## 常用命令

- `corepack pnpm dev:web`：只启动 `apps/web`。
- `corepack pnpm dev`：启动所有拥有 `dev` 任务的 JS/TS 工作区。
- `corepack pnpm lint`：运行工作区 lint。
- `corepack pnpm typecheck`：运行 TypeScript 检查。
- `corepack pnpm content:check`：校验 Frontmatter、slug、内容资源、站内链接和生成清单。
- `corepack pnpm build`：按依赖图构建工作区。
- `corepack pnpm check`：统一运行 lint、类型检查、测试和构建。
- `corepack pnpm format`：格式化仓库内支持的文本文件。

## 内容管理

V1 的文章与作品保存在 `apps/web/content`，与代码一同提交 GitHub。内容在构建期完成校验与页面生成，生产页面不在运行时请求 GitHub API。

未来如果管理后台成为第二个真实消费者，可以将共享 schema 和内容 API 契约抽取到 `packages/` 或仓库级 `contracts/`；原始 Markdown 是否迁入数据库则作为独立演进决策。

## 部署

- GitHub Pull Request：触发 Web CI 和 Vercel Preview。
- `main`：触发 Vercel Production。
- Vercel Root Directory：`apps/web`。
- 未来后端服务独立部署到合适的容器或云服务，不与 Web 强制绑定发布。

## 项目文档

- [V1 技术方案](docs/technical-design.md)
- [Web 应用说明](apps/web/README.md)
- [后端服务约定](services/README.md)

## 当前状态

- [x] GitHub 仓库初始化
- [x] V1 技术方案
- [x] pnpm Workspace + Turborepo Monorepo
- [x] `apps/web` Next.js 工程骨架
- [x] Web CI 基础门禁
- [x] Markdown/MDX 内容系统与构建清单
- [x] 首页、文章与作品页面
- [x] Excalidraw 只读画板与按需交互查看
- [x] RSS、sitemap、robots、JSON-LD 与社交分享图
- [ ] Vercel 项目连接与生产部署
