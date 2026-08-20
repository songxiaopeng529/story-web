# Content

这里是访客网站的 GitHub 内容真源。V1 的内容与 Web 应用放在一起，提交、审阅与发布都沿用 Git 工作流。

```text
content/
├── articles/   # 文章，使用 .md 或 .mdx
├── works/      # 作品，使用 .md 或 .mdx
└── resume.ts   # 首页简历结构化数据
```

## Frontmatter

文章与作品共用这些字段：

- `title`、`description`：标题与摘要。
- `date`、`updated?`：ISO 日期（`YYYY-MM-DD`）。
- `tags`：字符串数组。
- `published`：是否进入公开列表、RSS 与 sitemap。
- `featured`：是否进入首页精选区。
- `kind`：只能是 `article` 或 `work`。
- `cover?`：可选的站内图片路径。

作品还可以使用 `role`、`stack`、`repository`、`demo` 与 `year`。文件名就是路由 slug，请使用小写英文和连字符。

正文默认使用标准 Markdown。需要 `Callout`、`Whiteboard` 等受控组件时使用 `.mdx`；画板源文件放在 `public/boards`，不要在 `.excalidraw` 中嵌入大体积 base64 图片。图片画板使用顶层 `externalFiles` 映射引用 `public` 下的资源，由站内画板加载器注入 Excalidraw。
