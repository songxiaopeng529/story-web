# 水墨首页实现记录

## 设计与资产

- 依据用户选中的 `mockups/home-white-ink-v1.png` 还原：首页仅保留头像、首页／文章／作品导航、单行宋体 slogan 和墨迹。
- 使用 frontend-design 指导留白、字体层次与手机排版。没有额外按钮、说明文字或底部模块。
- GitHub 头像原图来自 `https://avatars.githubusercontent.com/u/188959302?v=4`，通过公开 GitHub 用户 API 核实，保存为 `assets/github-avatar.jpg`，部署副本为 `public/images/github-avatar.jpg`。
- 墨迹使用 imagegen 编辑模式，从获批设计图去除 UI，未通过代码重新绘制。原始输出保存为 `assets/ink-source.png`，经 Sharp 转换为 `public/images/ink-gesture.webp`（88,764 字节）。部署只使用 WebP。

### 墨迹编辑完整提示词

> Use case: precise-object-edit. Edit this exact approved homepage screenshot into a production background artwork. Remove ONLY the small top-left avatar, top-right navigation words and underline, and the Chinese slogan at left. Seamlessly fill these areas with the existing clean neutral white paper background. Keep the EXACT large black ink stroke in precisely the same location, same scale, every dry-brush fringe and gray tail preserved, same sharp edges and textures, same white canvas and same dimensions. Do not redraw, simplify, reinterpret, rotate, crop, shift or recenter the ink artwork. The output must be the existing black ink gesture on white alone with absolutely NO words, UI, avatar, frame or added objects. The purpose is to put real HTML text and navigation above the asset.

## 交互与边界

- 标题是可访问的 HTML 文本，逐字滚入一次，采用本机宋体字体栈；不同系统的宋体字形可能略有区别。
- 墨迹加载后遮罩显现一次，鼠标交互最大平移 5px／3px、旋转 0.25°，离开复位；不是墨水流体模拟。
- 手机触摸微幅缩放后复位，保留纵向滚动。减少动态效果偏好下完全静止，不启动 WebGL 或持续渲染循环。
- 文章、作品暂未开放，仅提供整理中提示。
- 删除旧玻璃组件、WebGL 渲染文件、黑色主题样式及公开玻璃资源。历史设计参考、文章、作品内容与 Git 历史保留。

## 验证

- 桌面 1440 × 960 与手机 390 × 844 实际浏览器截图检查；手机无横向溢出，图片正常加载，标题保持单行。
- ESLint、TypeScript、Next.js 静态构建通过。
- 静态导出检查验证 slogan、墨迹和头像资源、路径前缀以及旧玻璃资源移除。
