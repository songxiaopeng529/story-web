---
name: lark-to-article
description: 将用户提供的飞书 Docx/Wiki 文档转换为 story-web 的新文章，输出到 docs/articles，下载画板及图表、裁去外围空白并默认保留四周 30px，以标准 Markdown 相对路径引用。当用户要求把飞书文档转为文章、沿用之前转换方式，或在此网站项目中仅提供文档链接并要求导入时使用。纯粹阅读或摘要文档不触发。
---

# 飞书文档 → 网站文章

这是当前仓库的项目级技能，仅用于本项目的文章导入。用户只需提供文档链接。网站根目录取本技能所在 `.agents/skills/lark-to-article/` 的上三级目录，不依赖机器用户名或固定绝对路径；所有 `docs/articles/` 路径均相对此项目根目录。文档标题、slug、图片名自行从内容确定，无需再询问常规格式偏好。

## 输出约定

```text
docs/articles/<stable-english-slug>/
  <文章标题>.md
  images/01-<meaning>.png
  images/02-<meaning>.png
  sources/<diagram>.mmd     # 仅有 Mermaid 时保留源文件
```

- 每篇文章目录只有一个 Markdown 正文。图片使用 `![说明](images/01-example.png)`，不得引用临时路径、飞书 token、失效签名 URL 或机器绝对路径。
- 画板/图表图片在最终图片像素尺度上，上下左右默认各保留 **30px**。用户指定的留白优先。保持内部布局和原始分辨率，不重绘原图。
- 保留正文内容、代码、表格、超链接和图示顺序，不擅自摘要或纠正事实。普通表格保留为 Markdown 表格；图表按视觉图示处理。
- 不添加臆造的发布日期、作者或标签。不提交 git、不部署、不修改飞书源文档。

## 获取原文和资源

使用当前可用的 `lark-doc` 技能；先读取它的 fetch 参考，通过 `lark-cli docs +fetch --doc '<url-or-token>' --as user --doc-format markdown` 获取全文，保留完整 JSON（正文及 reference_map）到临时工作目录。按文档 URL 路径路由，Wiki 使用现有 lark-doc/lark-wiki 指引，不依赖域名猜类型。

- 只在凭据、身份、scope 出错时按 `lark-shared` 修复授权。macOS 钥匙串无法在沙箱访问时请求工具层提升权限，不降级钥匙串，不重置现有配置。需要用户授权则提供新链接及二维码，依技能 split-flow 完成；不要复用旧 device code。
- 从正文及 reference_map 盘点所有 whiteboard、img、图表、嵌入表格和 Mermaid。若 Markdown 缺失 token/嵌入内容，补取 XML full 查看结构，不将遗漏当作空白。
- 画板先按当前 `lark-whiteboard` 的导出指引操作；CLI 版本不支持 `whiteboard +export` 时，可按 `lark-doc` media-download 参考使用已支持的 `docs +media-download --type whiteboard --token ... --output ./原图 --as user`。成功响应的 saved_path/Content-Type 决定真实扩展名。
- 普通图片按 media-download 下载。内嵌 Sheets/Base 使用对应技能读取，不以占位文字替代。图表如不能直接导出，可从有权限的页面截取图表完整区域，避免裁掉图例、坐标轴或说明。
- 使用 CLI 时本地文件参数用相对当前工作目录的路径；完整原图、JSON 与运行日志放临时目录，不放公开文章目录。不要把源文档发送到公共图表渲染服务。

## 转换 Markdown

转换正文时需要基于结构处理，避免在代码块内做全局字符串替换：

- `<title>` 转为文章唯一的 `# 标题`；必要时把原章节标题整体下降一级，保持层级。
- `<callout>` 转为 `>` 引用，保留 emoji、段落、列表和强调。列表前留空行；段落换行按原语义处理。
- `<bookmark>` 转为普通 Markdown 链接；白板/图表替换为对应本地图片引用。
- Markdown 表格分隔符用 `---`。当前网站 `react-markdown` 使用 `skipHtml`，不要遗留依赖 HTML 的重要内容；表格内 `<br/>` 可换成 ` / ` 或等效可读文本。
- 原文中的代码示例保持逐字不变。不要把 Markdown 代码示例里的标签或标题误转换。
- Mermaid 在本机渲染为 PNG 并保留 `.mmd` 到 `sources/`，正文用图片引用。可使用临时安装的 `@mermaid-js/mermaid-cli` 配合本机 Chrome，先查 `--help`；无需改网站依赖。渲染后也应用同样的 30px 留白规则。
- 遇到无法转换的嵌入资源，继续完成独立部分并明确报告缺项；不要声称完整导入或悄悄省略。

## 画板裁剪

先查看原图，再运行本技能的 `scripts/crop-image.cjs`。脚本从白色/近白色背景上检测内容包围盒，默认阈值 235，然后扩展 30px；原画布不足时补白，不缩放。透明区域按白底处理，输出 PNG，保留原始输入。

```bash
# 在项目根目录执行
node .agents/skills/lark-to-article/scripts/crop-image.cjs \
  --root . \
  --input /tmp/article-import/original.jpg \
  --output /tmp/article-import/staged/images/01-overview.png \
  --padding 30
```

此算法适合已有白底画板。深色背景、淡线条、阴影、零散远端内容或普通照片要看图判断：不得裁掉真实信息；可调整阈值或人工确定矩形，照片一般保持原图。纯白图会报错，应检查源导出，不生成空白成功结果。不要对已裁过的图片反复有损编码，调整时从原图重做。

## 写入、同步和检查

1. 先在临时目录完成一篇文章及全部图片，验证后整体移入 `docs/articles/<slug>/`。新文章如遇重名，检查是否同一文档；不要覆盖不相关文章。用户未要求更新时保持已有内容。
2. 检查所有 Markdown 图片引用均可解析为文章目录内的真实文件，图示数量与原文一致，没有自定义占位标签或临时 token。核对正文段落、代码、表格及外链没有意外丢失。
3. 查看裁剪后的每张图（可生成联系表），确认标题、说明、图例和边缘图形完整，30px 是图片文件像素留白，而不是网页 CSS 留白。
4. 读取网站当前内容生成脚本后再同步。当前项目使用 `scripts/site-content.mjs` 的 `generateSiteContent()`，会从 `docs/articles` 生成 `apps/web/.generated/content.json` 并复制图片到 `apps/web/public/article-assets`：
   ```bash
   node --input-type=module -e "import {generateSiteContent} from './scripts/site-content.mjs'; generateSiteContent()"
   ```
   以仓库实际结构为准，不恢复已经删除的旧脚本，不改无关源码。若需要修改 Next.js 代码，先按 AGENTS.md 读取本地框架文档。
5. 验证生成列表包含新 slug，生成图片与源图片一致。若预览服务器运行，再检查文章页和图片加载；没运行不声称已检查网页。此类内容导入通常不需要改应用代码或全量构建。
6. 最终提供 Markdown 本地可点击链接、图片数量与留白值，以及任何真实缺项。不要把本地资源同步描述成公网部署。
