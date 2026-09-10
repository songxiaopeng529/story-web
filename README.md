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

河流生长原型位于 `/river-prototype/`：可切换 2/6/12 篇文章、1/3 个作品，演示副本不会写入内容库。河流随真实条目布局增加曲线段，小船沿切线转向。支持基础版与水彩 2.5D 对照、暂停水流；升级版使用 WebGL 流动纹理和船尾波，无 WebGL 时保留静态水彩。正式首页保持不变。

以 `docs/design/landing-explorations-2026-09-08/07-paper-adventure.png` 为视觉参考，重新绘制猫咪纸船及文章插画。

- 顺序：猫咪首屏 → 最近文章 → Story Forge → 页脚。
- 文章来自 `content/articles/`，按日期排序取最近三篇。当前有两篇。
- 首页仅展示 Story Forge，内容依据公开项目 README；面板是可切换的结构示意，不是产品截图。
- SVG 贝塞尔细线随布局尺寸重新计算，小纸船沿线响应滚动；猫咪插画轻微回应鼠标。减少动态效果时停止运动，触屏不拦截滚动。
- 紧凑导航使用淡杏色手绘色块表示当前区块；文章、作品导航随滚动同步。
- 旧银杏首页组件与线上图片已移除。历史设计、文章及旧作品详情仍保留，避免破坏内容链接。
- 静态详情支持 Markdown、表格、代码以及现有 Callout 正文，不执行任意 MDX JavaScript。

生产图片位于 `public/images/paper/`，三张 WebP 合计约 617 KiB。原始素材与提示词位于 `docs/design/assets/paper-adventure/`。

[设计方案](docs/design/paper-adventure-plan.md) · [技术方案](docs/technical-plan.md)

旧版可从 Git 历史恢复。历史内容中的架构描述不代表当前实现。
