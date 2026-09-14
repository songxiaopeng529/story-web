# Story

当前唯一正式实现位于 `apps/web`，首页为 `/`。采用已确认的 Story 视觉与模特视频，滚动控制人物转头；导航为 Home、Blog、Project，保留 Contact。

## 运行与检查

在仓库根目录执行：

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm verify:export
```

本地默认地址为 http://127.0.0.1:3000/，静态产物位于 `apps/web/out/`。

子路径部署检查：`NEXT_PUBLIC_BASE_PATH=/story-web pnpm build && NEXT_PUBLIC_BASE_PATH=/story-web pnpm verify:export`。

## 目录

- `apps/web/src/app`：唯一页面、样式、布局及滚动交互。
- `apps/web/public`：当前页面使用的四张图片与人物视频。
- `docs/articles`、`content/projects.json`：博客与作品的内容来源，构建时自动接入。
- `docs/design/lumenix-model/custom-male`：当前人物的参考图和视频脚本。

旧首页、minimal、river-prototype、lumenix 试验路由及其闲置素材均已删除。旧实现可通过 Git 历史查看。

Blog 与 Project 分别滚动至博客和作品区；Contact 下载本地项目简报，不发送消息。

## 博客与作品

首页 Blog 自动读取 `docs/articles/<slug>/` 中的 Markdown/MDX，点击进入 `/articles/<slug>/` 正文预览。每个目录放一篇正文，图片保持 `images/example.png` 这样的相对路径。可选 frontmatter：`title`、`description`、`date`、`tags`、`published`；`published: false` 不会展示。有日期的文章按日期倒序排列，无日期的排在后面。

作品集唯一来源为 `content/projects.json`，点击进入 `/works/<slug>/`。正文支持 Markdown、GFM 表格、代码块、图片；不执行 MDX 内的 JavaScript。图片可点击查看原图。首页人物视频保持滚动控制，正文页使用静态深色背景便于阅读。

开发时监听内容目录并更新；静态站部署后需重新构建才能发布新文章。生成数据在 `apps/web/.generated`，图片在 `apps/web/public/article-assets`，均不需要手动维护。

## 维护作品 JSON

编辑 `content/projects.json`，复制一条项目记录即可新增。数组顺序就是展示顺序；`published: false` 可隐藏项目。

- `slug`：唯一的小写英文路径，如 `story-forge`。
- `title`、`repository`、`tags`：项目名、HTTPS 仓库链接、技术标签。
- `description`：包含 `en` / `zh` 的中英文简介。
- `cover`：`theme` 为 `ember` 或 `paper`；`kicker`、`headline`、`caption` 为双语文案，`mark` 为短标记。
- `features`：双语项目介绍条目，自动显示在详情页。

开发预览会监听 JSON 修改，无需改 React 代码；线上静态站需重新构建部署。构建时会检查必填字段、重复 slug 和链接格式。
