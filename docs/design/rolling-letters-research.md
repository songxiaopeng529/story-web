# Rolling Letters：研究与首页应用意图

研究日期：2026-09-07。本轮只读参考文档与预览 DOM，不安装组件、不修改网站实现。

参考：[Originkit Rolling Letters](https://www.originkit.dev/components/rolling-letters?preset=base)。

## 已确认的公开信息

- 官方说明采用 GSAP，逐字符滚入，文字变化时重新触发。
- startFrom 控制从 top 或 bottom 进入；staggerFrom 支持 start、center、end、random。
- 当前 base 链接页面显示 Variant 1，控件为 Bottom、Center、H1、Ease Out。
- 字体、颜色、语义标签、时长、延迟、错峰与缓动可配置。
- 实际预览 DOM 是 overflow:hidden 的 h1，字符为独立的 inline-block span.char；静止时 transform 为 translate(0px,0px)。并非视频或整张文字图片。
- 页面提供 Code / CLI 等获取入口。本次 Copy Code 后未取得非空源码，因此不声称已审阅完整源文件、依赖声明或许可。

## 我们的实现思路（方案，不是对未读源码的描述）

保留真实语义标题，将显示层按字素拆分；利用裁切容器隐藏进入前的字符，让 GSAP 驱动各字纵向位移并错峰收束到基线。逐字 span 的辅助功能处理需保证读屏器只朗读完整句子一次。不要将截图中的文字烘焙成最终网页资产。

首页拟用从下进入、从左到右展开，呼应左对齐标题；整体约 0.9–1.2 秒，每字错峰约 35–50ms，先作为调试起点，不代表原组件默认值。首次入场播放一次，完成后保持静止；不做持续循环、随机抖动或文字轮播。玻璃可继续缓慢变化，两者区分节奏。

中文使用完整字素切分，标点保留。桌面单行；窄屏通过字号缩放适配，极窄屏允许自然换行，不能横向溢出。等待字体可用后播放，避免字宽跳动；减少动态效果偏好下直接呈现最终标题。后续 Next.js 接入时再验证客户端生命周期、动画清理、静态导出和实际移动设备性能。

## 与设计图的关系

[home-v3.png](mockups/home-v3.png) 表现动画结束后的静态排版，不展示动画中间的裁字或拖影。第三版 slogan 为单行“让想法，慢慢成形。”，字号更大，位置保持左上，避免覆盖玻璃。
