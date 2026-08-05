# @story-web/web

面向访客的个人网站，位于 story-web Monorepo 的 `apps/web` 工作区。

## 本地开发

在仓库根目录执行：

```shell
corepack pnpm install
corepack pnpm dev:web
```

打开 [http://localhost:3000](http://localhost:3000)。应用代码位于 `src/app`，文章、作品和简历位于 `content`。

## 常用命令

以下命令均在仓库根目录执行：

- `corepack pnpm dev:web`：只启动访客网站。
- `corepack pnpm build`：构建所有拥有 `build` 任务的工作区。
- `corepack pnpm lint`：运行工作区 lint。
- `corepack pnpm typecheck`：运行 TypeScript 检查。
- `corepack pnpm content:generate`：从 Markdown/MDX 生成类型化静态 import 清单。
- `corepack pnpm content:check`：确认 Frontmatter、资源、站内链接和清单均有效。

## 内容

- `content/resume.ts`：首页简历的单一数据入口。
- `content/articles`：文章，支持 `.md` 和 `.mdx`。
- `content/works`：作品，支持 `.md` 和 `.mdx`。
- `public/boards`：Excalidraw 源文件。

`dev` 与 `build` 会自动刷新 `src/generated/content-manifest.ts`。生成文件需要提交，但不要手工修改。新增内容前请先阅读 [`content/README.md`](content/README.md)。

如果已确定正式域名，在 Vercel 配置 `NEXT_PUBLIC_SITE_URL`；未配置时本地默认使用 `http://localhost:3000`。

## 部署

Vercel 项目的 Root Directory 设置为 `apps/web`，生产分支使用 `main`。
