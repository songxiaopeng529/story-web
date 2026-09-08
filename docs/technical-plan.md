# 个人网站重构方案

## 目标与本轮状态

建立一个黑白、克制、排版精致的个人网站，一级导航只有首页、文章和作品。
文章与作品由 GitHub 仓库中的文件维护，通过 GitHub Actions 构建并发布到 GitHub Pages。

已完成分支准备、旧实现清理、内容迁移、方案设计与首页 V1。根目录 Next.js 应用现已可运行，首页对齐 home-v3.png；文章／作品内容系统与部署流程仍是后续计划。没有修改远程 main，也未发布到线上。

## 技术选择

- Next.js App Router + TypeScript：页面组织、静态生成、元数据与少量交互。
- 单项目结构 + pnpm：应用直接位于仓库根目录，不再保留 apps/packages/services、workspace 或 Turborepo。
- 首页 V1 使用集中式 CSS tokens 与语义类管理字体、字号、留白和响应式规则；暂不引入尚未需要的 Tailwind 依赖，后续内容系统可按需增加。
- Markdown 为主、MDX 为补充：普通文章直接写 Markdown；作品需要提示框、图集等内容时使用受控 MDX 组件。
- gray-matter 解析 Frontmatter，Zod 校验字段；编译流程采用 @next/mdx 与 remark/rehype 生态，在初始化时锁定兼容版本。
- V1 不需要数据库、后台管理端或在线编辑器。编辑入口是本地编辑器与 GitHub 文件编辑界面。

Next.js 采用 `output: 'export'`。构建时执行内容读取和页面生成，导出 `out/` 中的 HTML、CSS、JS；访问网站时仍然可以运行客户端动画和交互。GitHub Pages 仅托管这些静态文件，不运行 Next.js 服务端。[Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)

## 计划目录

```text
story-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 全局 Header、字体和基础元数据
│   │   ├── page.tsx               # 首页
│   │   ├── globals.css
│   │   ├── articles/
│   │   │   ├── page.tsx           # 文章列表
│   │   │   └── [slug]/page.tsx    # 文章详情
│   │   ├── works/
│   │   │   ├── page.tsx           # 作品列表
│   │   │   └── [slug]/page.tsx    # 作品详情
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/                # Header、导航
│   │   ├── home/                  # 首页主视觉、动画
│   │   └── content/               # 正文、目录、图片、MDX 组件
│   ├── lib/
│   │   ├── content.ts             # 构建时读取内容
│   │   ├── content-schema.ts      # 字段校验
│   │   └── urls.ts                # 统一域名、basePath 和资源路径
│   ├── config/site.ts
│   └── mdx-components.tsx
├── content/
│   ├── articles/*.mdx             # 也支持 .md
│   ├── works/*.mdx
│   └── resume.ts                  # 已迁移的个人资料，后续按页面需要简化
├── public/images/                 # 后续新增封面与正文图片
├── scripts/                       # 内容校验、生成索引与 RSS
├── .github/workflows/pages.yml
├── docs/technical-plan.md
├── next.config.ts
├── package.json
└── pnpm-lock.yaml
```

详情页是文章与作品栏目的子页面，不增加一级栏目。

## 内容协议与构建

沿用已有内容的核心字段，减少内容搬迁成本：`title`、`description`、`date`、`tags`、`published`、`kind`；可选 `updated`、`cover`、`featured`。作品补充 `role`、`stack`、`repository`、`demo`、`year`。文件名作为稳定 slug。

例如，在 `content/articles/my-first-post.md` 写入：

```md
---
title: "我的第一篇文章"
description: "记录一次设计与开发实践。"
date: "2026-09-06"
tags: [设计, 开发]
published: true
kind: article
---

这里开始写正文。
```

构建流程：读取文件 → 校验元数据与 slug → 过滤 `published: false` → 编译正文 → 生成列表、详情、RSS、站点地图。

内容编译器仅注册已发布文件，不把草稿正文放进公开产物；公开仓库中的草稿源文件仍然公开可读，不能把 `published: false` 当成保密机制。MDX 只编译仓库中由作者维护和审阅的文件。

使用构建脚本生成确定的 MDX 导入映射，避免任意动态文件路径导致打包漏掉正文。为文章、作品详情实现 `generateStaticParams()`，枚举所有已发布 slug；未知地址返回静态 404。正文、列表、标题等内容预先生成，动画、筛选等必要部分才使用客户端组件。

## GitHub Pages 部署

当前仓库名是 `story-web`，默认项目站点地址将是 `https://songxiaopeng529.github.io/story-web/`。若希望使用根地址 `https://songxiaopeng529.github.io/`，需要使用名为 `songxiaopeng529.github.io` 的用户站点仓库。这里先按现有项目仓库方案设计，不修改仓库名称。[GitHub Pages 站点类型](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

核心配置计划：

```ts
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
```

GitHub Pages 构建时设置 `NEXT_PUBLIC_BASE_PATH=/story-web`；本地默认空前缀。Next.js Link 处理内部路由前缀；普通图片路径、正文相对链接、下载地址、RSS 与 sitemap 通过统一辅助函数处理，避免遗漏或重复添加前缀。站点绝对 URL 由域名与 basePath 共同计算。

`trailingSlash: true` 使详情页生成目录内的 `index.html`，验收时必须直接打开并刷新文章、作品详情地址。默认服务端图片优化不能用于静态导出，图片使用预压缩资源，并设置尺寸与按需加载。[Next.js 静态导出约束](https://nextjs.org/docs/app/guides/static-exports)

自动发布流程：

1. PR：安装锁定依赖，校验内容、lint、类型检查和静态构建；产物作为构建附件供检查。
2. 合并 main：构建完成后，上传 `out/` 为 Pages artifact。
3. 部署 job 使用 GitHub Pages 官方 Actions 发布，赋予所需的 `pages: write`、`id-token: write` 权限，并配置 `github-pages` environment。
4. 仓库 Settings → Pages 的发布来源设置为 GitHub Actions。PR 校验不等于已经获得一个独立的在线预览站点。

最终 workflow 在接入时参照官方示例确定 action 版本、并发策略和权限。用户日常只需添加或修改内容文件，再合并到 main。[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

V1 不使用 SSR、Server Actions、ISR、运行时 API 或请求相关 Cookie 能力。站内搜索后续可增加静态索引；联系入口可先用邮箱和社交链接。若未来增加登录或表单后端，再引入独立服务。

## 视觉与实施顺序

技术框架不会自动产生漂亮的设计。先确定字体、黑白层级、网格、留白和响应式规则，再写页面。首页沿用已明确的内容边界：顶部 Header 与一个主视觉，导航固定为首页、文章、作品；具体主视觉重新设计，不自动恢复旧动画。动画模块独立加载，为低性能设备、无 WebGL 与减少动态偏好提供可读的静态后备。

1. 初始化根目录 Next.js 项目，完成三栏导航与静态导出；用带 `/story-web` 前缀的产物验证路由、CSS 和图片。
2. 完成首页视觉，检查桌面、手机、键盘导航和动效降级。
3. 接入文件内容系统，实现文章／作品列表和详情，迁移与审阅现有内容。
4. 补齐正文排版、封面、代码高亮、阅读目录、SEO 与 RSS。
5. 配置 GitHub Actions 与 Pages；部署前验收导出产物、深链刷新、资源路径和 404。

验收目标是：新增一篇文章或一个作品，只修改内容和配图即可发布；页面实现不需要随每篇内容手动修改。
