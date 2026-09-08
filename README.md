# story-web

面向 GitHub Pages 重构的个人网站，保留首页、文章、作品三个入口。

当前分支 `codex/rebuild-nextjs-pages` 从远程 `main` 的 `147fd1c` 创建。
已初始化根目录 Next.js App Router 应用，目前实现自然档案首页，以及现有文章／作品的静态详情页。尚未创建部署工作流，也没有发布到线上。

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 http://127.0.0.1:3000。`pnpm lint`、`pnpm typecheck`、`pnpm build` 分别执行代码检查、类型检查与静态导出。导出目录为 `out/`。

GitHub Pages 项目路径验证：`NEXT_PUBLIC_BASE_PATH=/story-web pnpm build`。本地默认不带路径前缀。

## 当前首页：自然档案

- 视觉依据：`docs/design/landing-explorations-2026-09-07/04-living-archive.png`。白底、深绿宋体、紧凑姓名导航与滚动分区。
- 首屏银杏叶底图轻微模糊；圆形放大镜显示同一张清晰原图并放大 1.85 倍，跟随指针，方向键也可移动，Escape 收起。
- 使用 Pointer Events 与按需 requestAnimationFrame，不引入 WebGL 或持续空转循环。触摸按住观察、纵向手势正常滚动；减少动态效果时去除缓动，无 JavaScript 时保留清晰原图。
- 作品区在独立水彩底纹上绘制 SVG 关系图；只有标有真实作品名的节点可点击，其他细枝为装饰。“正在生长的作品”位于图上方。
- 慢读作为文章入口，下方列表从 `content/articles/` 读取。详情页在构建时生成，表格、代码和原有 Callout 正文均可阅读，不执行任意 MDX JavaScript。
- Header 首页／文章／作品指向首页相应区块，绿色圆点随滚动更新；详情页有回到对应区块的入口。
- 旧水墨组件、逐字动画、GSAP 依赖及不再使用的公开墨迹和头像资源已移除；历史设计、原始头像、文章和作品内容保留。

当前生产资产为 `public/images/natural-leaf.webp`、`natural-wash.webp` 与 `natural-reading.webp`，合计约 773 KiB。原始生成素材与完整提示词保存在 `docs/design/assets/natural-archive/`，不随页面发布。见 [实现方案](docs/design/natural-archive-plan.md) 和 [验收记录](docs/design/natural-archive-verification.md)。

原有两篇文章、两个作品和个人资料已原样迁移到 `content/`，正文中的历史实现描述尚未更新；它们是内容资料，不是新架构的说明。
旧实现可以从 Git 历史 `147fd1c` 恢复。未跟踪的 `work/` 本地资料与依赖、构建缓存不属于此次源码清理范围。

新方案见 [技术方案与实施顺序](docs/technical-plan.md)。
