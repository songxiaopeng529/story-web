# story-web

面向 GitHub Pages 的 Next.js 个人网站，保留首页、文章、作品三个入口。

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 http://127.0.0.1:3000。运行 `pnpm lint`、`pnpm typecheck`、`pnpm build` 和 `pnpm verify:export` 检查实现。静态输出位于 `out/`，暂未配置部署工作流。

项目路径验证：`NEXT_PUBLIC_BASE_PATH=/story-web pnpm build && NEXT_PUBLIC_BASE_PATH=/story-web pnpm verify:export`。

## 当前首页：纸上冒险

河流生长原型位于 `/river-prototype/`：默认显示全部真实文章，也可切换 2/6/12 篇文章的演示模式、1/3 个作品，演示副本不会写入内容库。河流随真实条目布局增加曲线段，小船沿切线转向。支持基础版与水彩 2.5D 对照、暂停水流；升级版使用 WebGL 流动纹理和船尾波，无 WebGL 时保留静态水彩。正式首页保持不变。

以 `docs/design/landing-explorations-2026-09-08/07-paper-adventure.png` 为视觉参考，重新绘制猫咪纸船及文章插画。

- 顺序：猫咪首屏 → 最近文章 → Story Forge → 页脚。
- 文章唯一来源为 `docs/articles/`，正式首页与河流页默认显示全部文章；可选日期按新到旧排序，无日期的文章按文件夹名排序放在后面。
- 首页仅展示 Story Forge，内容依据公开项目 README；面板是可切换的结构示意，不是产品截图。
- SVG 贝塞尔细线随布局尺寸重新计算，小纸船沿线响应滚动；猫咪插画轻微回应鼠标。减少动态效果时停止运动，触屏不拦截滚动。
- 紧凑导航使用淡杏色手绘色块表示当前区块；文章、作品导航随滚动同步。
- 旧银杏首页组件与线上图片已移除。历史设计、文章及旧作品详情仍保留，避免破坏内容链接。
- 静态详情支持 Markdown、表格、代码以及现有 Callout 正文，不执行任意 MDX JavaScript。

生产图片位于 `public/images/paper/`，三张 WebP 合计约 617 KiB。原始素材与提示词位于 `docs/design/assets/paper-adventure/`。

[设计方案](docs/design/paper-adventure-plan.md) · [技术方案](docs/technical-plan.md)

旧版可从 Git 历史恢复。历史内容中的架构描述不代表当前实现。

## 以后如何添加文章

只维护一个目录：`docs/articles/<文章英文短名>/`。每个目录放一个 `.md` 或 `.mdx` 文件（中文文件名也可以）和相关图片，例如：

```text
docs/articles/hdfs-introduction/
  HDFS 入门.md
  images/
    01-hdfs-layers.png
```

正文里保持相对路径：`![示意图](images/01-hdfs-layers.png)`。文件夹名决定网址 `/articles/hdfs-introduction/`，改文件夹名会改变网址。不要往同一个文件夹放多篇 Markdown。

无需填写元数据也能显示：标题取一级标题（没有则取文件名），摘要取首个普通段落。若要指定日期、摘要、标签或隐藏草稿，可在同一份原文顶部选填：

```yaml
---
date: "2026-09-12"
description: "这篇文章的简介"
tags: [HDFS, 存储]
published: true
---
```

`published: false` 的文件夹不公开，缺省为公开。不要将私密文档放进 `docs/articles`。`docs/design` 等其他目录不会被读取。

运行 `pnpm dev` / `pnpm build` 时自动从原文生成 `.generated/articles.json` 和 `public/_article-assets/` 图片输出。这两个目录是被 Git 忽略的构建产物，不要手动维护。开发服务会监听新增、修改、删除；刷新浏览器即可查看。已经部署的 GitHub Pages 需要重新构建发布才会更新。

图片支持 PNG、JPEG、WebP、GIF、SVG、AVIF，可放嵌套目录。图片文件夹随原文一起提交即可，不需要复制到 public。当前不把其他类型的附件自动发布。

测试：`pnpm test:articles`。文章入口、全部列表及导出图片由 `pnpm verify:export` 校验。作品仍读取 `content/works/`，不受本次文章迁移影响。
