# story-web 视觉调研与设计规范

> 调研日期：2026-08-06
> 适用范围：`apps/web` 首页、文章、作品、MDX 正文与 Excalidraw 画板
> 结论：采用 **Flexoki Editorial（暖白纸张上的现代编辑部）**，而不是继续强化黑白瑞士海报感。

## 1. 研究问题与方法

“调研所有开源博客”不是一个可以穷尽的集合。本次采用与 story-web 目标最相关的系统抽样：

1. 核验 15 个仍有代表性的开源博客、简历或作品集项目，关注许可证、维护状态、信息架构与可借鉴性。
2. 对 10 个真实个人网站做视觉模式分析，关注首页信息密度、长文版心、色彩、字体、媒体与动效。
3. 用 WCAG 2.2、W3C 中文排版需求、USWDS、web.dev 等权威资料，把主观风格转换为可验收的数值规范。
4. 对现有代码做逐项审计，区分“需要保留的能力”和“导致粗糙感的视觉信号”。

评估优先级依次为：中文长文可读性、个人简历与作品的兼容性、低维护成本、无障碍、视觉辨识度、技术栈接近程度。

## 2. 核心结论

当前网站的粗糙感不是来自功能不足，而是多个高强度信号同时出现：最大 `10rem` 的标题、整屏 Hero、编号、全大写等宽标签、密集横线、整行黑白反转和 sticky blur。每个元素单独看都成立，组合后却更像设计展海报，而不是长期阅读的个人档案。

最适合 story-web 的方向是：

- 用 [Flexoki](https://stephango.com/flexoki) 的暖纸、墨色与克制蓝建立阅读氛围。
- 用 [Steph Ango](https://stephango.com/) 的内容优先结构管理文章档案。
- 用 [Emil Kowalski](https://emilkowal.ski/) 的窄版心和大区块留白控制节奏。
- 用 [Craig Mod](https://craigmod.com/) 的“窄正文、宽媒体”规则承载作品图片与画板。
- 保留少量编号与 mono metadata 作为个人识别，但不再让它们成为主视觉。

一句话原则：**让内容先被理解，再让细节被发现。**

## 3. 开源项目样本

### 3.1 最值得组合借鉴的五个项目

| 项目                                                                                                                                               | 许可证 | 最值得借鉴                                            | 不直接照搬的部分                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------- | ---------------------------------- |
| [Magic UI Portfolio](https://github.com/magicuidesign/portfolio) / [Demo](https://portfolio-magicui.vercel.app/)                                   | MIT    | 首页即简历：简介、经历、技能、作品、文章连续叙事      | 标签胶囊、浮动 Dock 和偏多动效     |
| [Minimalist CV](https://github.com/BartoszJarocki/cv) / [Demo](https://cv.jarocki.me/)                                                             | MIT    | 时间、角色、组织与说明的高密度简历语法                | 缺少完整博客与作品详情体系         |
| [Retypeset](https://github.com/radishzzz/astro-theme-retypeset) / [Demo](https://retypeset.radishzz.cc/en/)                                        | MIT    | 中文友好的纸张感、书籍式正文、细线与克制留白          | 没有简历和作品信息架构             |
| [AstroPaper](https://github.com/satnaing/astro-paper) / [Demo](https://astro-paper.pages.dev/)                                                     | MIT    | 文章列表、归档、键盘与屏幕阅读器考虑、MDX 与 TOC      | 全站等宽字体偏冷，只应借鉴内容体验 |
| [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) / [Demo](https://tailwind-nextjs-starter-blog.vercel.app/) | MIT    | Next.js + MDX、标签、目录、代码、数学公式、RSS 与 SEO | 默认视觉较通用，功能多于 V1 所需   |

组合方式：Magic UI Portfolio 提供首页骨架，Minimalist CV 提供简历语法，Retypeset 提供视觉基线，AstroPaper 提供文章列表与无障碍参考，Tailwind Next.js Starter Blog 提供内容详情经验。

### 3.2 其余核验样本

| 项目                                                                                       | 许可证  | 判断                                                     |
| ------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------- |
| [Brittany Chiang v4](https://github.com/bchiang7/v4)                                       | MIT     | 项目叙事成熟，但深蓝青配色、侧栏与动效不符合本次克制方向 |
| [al-folio](https://github.com/alshedivat/al-folio)                                         | MIT     | 学术、出版物、CV、项目与博客齐全，但导航与配置面过重     |
| [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus)                       | MIT     | 元信息简洁，终端感较强，缺少简历与作品系统               |
| [Dante](https://github.com/JustGoodUI/dante-astro-theme)                                   | GPL-3.0 | 暖象牙白和编辑部气质接近目标；直接复用需遵守 GPL         |
| [Astrofy](https://github.com/manuelernestog/astrofy)                                       | MIT     | 功能覆盖完整，但固定侧栏较重，维护活跃度较低             |
| [Hugo Blog Awesome](https://github.com/hugo-sid/hugo-blog-awesome)                         | MIT     | 页头页尾极简，但作品承载能力有限                         |
| [Minimal Hugo Website](https://github.com/pmichaillat/hugo-website)                        | MIT     | 纸张式履历清晰，个人作品表达偏保守                       |
| [HugoBlox Developer Portfolio](https://github.com/HugoBlox/hugo-theme-developer-portfolio) | MIT     | IA 完整，卡片、徽章和框架感过重                          |
| [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)                          | MIT     | 功能完备度检查清单很好，视觉与配置都偏传统               |
| [Hendra Agil](https://github.com/hendraaagil/website)                                      | MIT     | 首页同时组织文章与作品，组件数量偏多                     |

### 3.3 许可证边界

公开源码不等于可以自由复制。GitHub 的[许可证说明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)明确指出，没有许可证时默认版权仍然适用。

- [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) 使用 CC BY-NC 4.0，要求署名且禁止商业使用，只作为视觉灵感。
- [Nim](https://github.com/ibelick/nim)、[Lee Robinson 的 next-mdx-blog](https://github.com/leerob/next-mdx-blog) 和 [chronark.com](https://github.com/chronark/chronark.com) 在本次核验时未发现根目录许可证，只参考公开呈现，不复制实现。
- [Paco Coursey 的旧站源码](https://github.com/pacocoursey/paco) 未发现明确许可证且已归档，同样只作视觉分析。

本项目不会整体套用任何模板，只吸收可泛化的布局原则并在现有代码上独立实现。

## 4. 优秀个人网站的视觉模式

| 站点                                           | 模式                | 对 story-web 的启发                                     |
| ---------------------------------------------- | ------------------- | ------------------------------------------------------- |
| [Steph Ango](https://stephango.com/)           | 暖纸内容档案        | Latest、Topics、按年月 Writing；色彩与结构都服务阅读    |
| [Maggie Appleton](https://maggieappleton.com/) | 视觉论文 / 数字花园 | 多内容类型与定制 MDX 很适合画板，但持续制作成本较高     |
| [Robin Sloan](https://www.robinsloan.com/)     | 印刷书页            | 单一身份色就能形成个性，作品按出版目录而不是卡片组织    |
| [Craig Mod](https://craigmod.com/)             | 编辑部              | 长文窄栏，摄影和作品媒体可以突破版心                    |
| [Frank Chimero](https://frankchimero.com/)     | 极简编辑索引        | 极少导航、极大留白、标题和日期即可建立归档秩序          |
| [Emil Kowalski](https://emilkowal.ski/)        | 克制现代主义        | 身份、项目、写作顺序明确；动效只在需要解释交互时出现    |
| [Paco Coursey](https://paco.me/)               | 深色工作室          | 分组清晰、链接反馈轻；深色不是本次主方向                |
| [Brian Lovin](https://brianlovin.com/)         | 黑底内容索引        | 聚焦但偏冷，不适合长期中文阅读                          |
| [Julia Evans](https://jvns.ca/)                | 技术资料库          | 分类与日期归档非常适合文章量增长后的阶段                |
| [Simon Willison](https://simonwillison.net/)   | 信息密集日志        | 多内容类型和搜索适合上百篇内容，V1 不应提前复制这种密度 |

对比后形成三套候选：

1. **Flexoki Editorial，9/10，采用。** 暖纸、墨色、窄正文、宽媒体、少量蓝色交互状态。
2. **Quiet Studio，7.5/10。** 纯黑白、极大留白、几乎无图形；实现容易但开发者作品站同质化明显。
3. **Visual Garden，7/10。** 衬线、插画、画板和交互组件更自由；辨识度高但内容制作成本不符合当前阶段。

## 5. 标准与设计建议的分层

### 5.1 WCAG 2.2 AA 验收线

| 项目         | 基线                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 文本对比度   | 普通文本至少 `4.5:1`，大文本至少 `3:1`。[WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)                                                                                                   |
| 非文本对比度 | 有功能的控件边界、图标、状态和定制焦点至少 `3:1`。[WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                       |
| 字号缩放     | 放大到 `200%` 时不丢内容与功能。[WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)                                                                                                                |
| 页面重排     | `320 CSS px` 宽时，普通内容不应要求双向滚动。[WCAG 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                                                                       |
| 键盘与焦点   | 功能可由键盘操作，焦点可见且不被 sticky header 完全遮挡。[Keyboard](https://www.w3.org/TR/WCAG22/#keyboard-accessible)、[Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) |
| 点击目标     | 至少 `24×24 CSS px` 或满足间距例外；本站把独立控件的舒适值定为 `44×44px`。[Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                                                             |
| 文本间距兼容 | 用户覆盖行高、段距、字距与词距时不能截断或丢功能。[WCAG 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                                                                                            |

“西文不超过 80 字符、CJK 不超过 40 字”来自 WCAG `1.4.8 AAA` 的用户可调整机制，不是 AA 对默认样式的硬要求。本项目仍把约 38–40 个中文字符作为产品级阅读目标。[WCAG Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)

### 5.2 阅读与排版建议

- [USWDS Typography](https://designsystem.digital.gov/components/typography/) 建议正文有效字号至少 `16px`、长文行高至少 `1.5`，西文长文目标约 `66` 字符。
- [web.dev Typography](https://web.dev/learn/design/typography) 建议西文单栏 `45–75` 字符，使用相对单位和无单位行高。
- [W3C 中文排版需求](https://www.w3.org/International/clreq/)记录中文书籍正文常见 `17–40` 字，横排不宜超过 `48` 字。
- [Utopia](https://utopia.fyi/) 用 `clamp()` 在小屏与大屏之间连续插值字号和空间，减少人为断点与尺寸跳变。
- 暗色模式不是 WCAG 要求。V1 先把浅色阅读体验做到完整，未来增加暗色时重新逐项验证对比度。

## 6. story-web 最终设计系统

### 6.1 色彩

采用 Flexoki 的语义化子集：

```css
:root {
  --canvas: #fffcf0;
  --paper: #f2f0e5;
  --ink: #100f0f;
  --muted: #6f6e69;
  --line: #cecdc3;
  --line-strong: #878580;
  --accent: #205ea6;
}
```

- `ink / canvas` 对比度约 `18.62:1`。
- `muted / canvas` 约 `4.97:1`，可用于普通辅助文本。
- `accent / canvas` 约 `6.36:1`，只用于链接、焦点和交互状态。
- `line` 仅作装饰分隔；需要表达控件边界时使用 `line-strong`。
- 强调色在单页视觉面积中保持很低，只让交互被识别，不把网站变成蓝色主题。

### 6.2 字体与字号

- 正文与 UI：系统无衬线栈，避免中文 Web Font 的巨大下载体积。
- 中文展示标题：系统宋体栈，只用于姓名、页面标题、区块标题与引用。
- 日期、标签、代码：系统等宽字体。
- 正文：移动端 `17px`，桌面最高 `18px`，行高 `1.82`。
- 中文正文：`max-inline-size: 38em`，目标约 38 个全角字。
- 页面/文章 H1：移动端约 `42–60px`，桌面最高约 `76px`。
- 区块 H2：约 `36–54px`；正文 H2 约 `30–38px`；H3 约 `24px`。
- 元信息：`12.5px / 1.4`，只承载日期、标签与短标签。
- 中文不使用全局负字距；标题行高不低于 `1.0`。

### 6.3 空间、版心与边界

基础空间集合：`4, 8, 12, 16, 24, 32, 48, 64, 96px`。

- 总容器：`74rem`。
- 页面边距：手机 `20px`，随视口流式增长，桌面最高 `64px`。
- 正文：`38em`；桌面 TOC：约 `11–14rem`；中间空隙 `48–80px`。
- `1024px` 以下切换为单栏和折叠目录，断点由内容容纳能力决定。
- 图片、代码、表格和画板可以在自身容器内扩展或滚动，页面本身不产生横向滚动。
- 边框默认无圆角；画板等嵌入面板可以保留极小圆角，但不建立卡片系统。

### 6.4 组件规则

**Header**

- 高度 `60px`，不透明纸色和一条细线，不使用 backdrop blur。
- 导航只显示「首页、文章、作品」，移除重复编号。
- 当前页面使用下划线和文字颜色共同表达。

**首页 Hero**

- 姓名是唯一主角，最大约 `96px`，不再达到 `160px`。
- 首屏最高约 `46rem`，不强制每个设备都占满一屏。
- 摘要保持一段，元信息只说明个人档案和 GitHub 内容真源。

**简历**

- 经历使用“时间 / 组织与角色 / 说明”横向行，小屏自然变成单列。
- 没有真实教育信息时不显示占位卡片；内容确认后再自动出现。
- 用空间和字重建立层级，不为每个小节重复加入粗线或黑底。

**文章与作品列表**

- 日期或年份是第一列，标题与摘要是主列，标签为弱辅助列。
- 移除装饰性序号；列表本身的时间顺序已经足够表达关系。
- Hover 使用浅纸色、标题下划线和箭头轻移，不再整行黑白翻转。

**长文**

- 正文左对齐、右侧自然参差；不使用浏览器两端对齐。
- `line-break: strict; word-break: normal; overflow-wrap: anywhere`。
- 标题上方空间明显大于下方，正文小节不再一律用横线切开。
- 行内链接保留下划线；引用使用细蓝线；代码使用墨色底。
- 目录至少有 3 个有效标题才出现，桌面 sticky、移动端 `<details>`。

**表格、代码与画板**

- `<table>` 保留原生表格语义，由外层可聚焦容器负责横向滚动。
- `<pre>` 可通过键盘聚焦，横向滚动时不要求页面本身移动。
- 画板继续使用现有 `<Whiteboard />`：服务端静态摘要、点击后懒加载只读 Excalidraw。
- 画板是作品过程材料而不是装饰卡片；原始 `.excalidraw` JSON 继续与文章一起由 GitHub 管理。[Excalidraw](https://github.com/excalidraw/excalidraw) 使用 MIT 许可证。

### 6.5 动效与焦点

- 普通反馈 `160–200ms`，只使用颜色、透明度和小于 `8px` 的位移。
- 开屏仅首次会话出现，总时长控制在约 `1s`，可点击或按 `Esc` 跳过。
- `prefers-reduced-motion` 下直接显示最终状态。
- 普通页面使用高对比蓝色焦点环；墨色开屏继承暖白焦点环，避免黑底黑环。
- 所有独立导航、链接和按钮的命中高度保持至少 `44px`。

## 7. 对现有实现的改造清单

### P0

- 修复开屏等墨色区域不可见的黑色焦点环。
- 让代码块和表格横向滚动区域可由键盘聚焦，并恢复 `<table>` 原生 display 语义。

### P1

- 把巨型标题、`.82` 行高和中文负字距收敛到新的流式尺度。
- 容器从 `80rem` 收至 `74rem`，正文从固定 `44rem` 改为中文友好的 `38em`。
- 移除列表序号和整行反色，减少全大写 metadata 与强分隔线。
- 统一暖白纸张，取消 Header blur 和黑色 Contact 大色块。

### P2

- 辅助文字统一到约 `12–13px`。
- 开屏从约 `1.4s` 缩到约 `1s`，保留首次会话与 reduced-motion 逻辑。
- 教育信息为空时不再公开显示占位文案。

### 暂缓

- 暗色模式、全文搜索、复杂分类页和更多首页内容类型等到真实内容量出现后再引入。
- 不为了“看起来完整”加入头像、假项目封面、虚构履历或装饰插画。

## 8. 验收标准

- 视觉：任一页面只有一个主视觉焦点；辅助标签不会与标题争夺注意力。
- 阅读：正文桌面约 38 个中文字符宽，17–18px / 1.82，页面没有横向滚动。
- 交互：键盘可到达导航、列表、开屏跳过、代码、表格与画板控件，焦点始终可见。
- 响应式：320px、768px、1024px 和桌面宽度下内容不截断，布局由双栏自然退化为单栏。
- 动效：普通反馈不超过 200ms；开屏只出现一次且 reduced-motion 下跳过。
- 内容：简历、文章、作品和画板继续由现有类型化数据与 MDX 管线驱动，不引入模板耦合。
