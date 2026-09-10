# 纸上冒险验收 · 2026-09-08

- pnpm lint、pnpm typecheck、pnpm build、pnpm verify:export 通过。
- 根路径与 /story-web 前缀静态导出通过：8 个 HTML 页面、104 个本地引用。
- 浏览器实看桌面、768px 平板、390px 手机；均无横向溢出。
- 三张图片加载成功；桌面两列、手机单列，文章先于作品。
- Story Forge 扩展能力按钮切换成功，展示 Memory / Skills / MCP；导航滚动到作品时高亮作品。
- 文章详情可打开，回到文章区和首页可用。
- 修复路由离开时布局元素已经卸载导致的 offsetTop 读取错误；修复后再次往返无新增错误记录。
- 细线起点根据猫咪实际尺寸定位，末段绕开作品文案；减少动态效果的保护已在代码中实现。
- 旧首页组件与三个自然主题线上资产删除，源素材仍留在历史设计目录及 Git 历史中。
- 新图片使用内置 imagegen 生成，提示词及 PNG 原图见 assets/paper-adventure；WebP 总计 631730 字节。

Story Forge 项目结构依据 GitHub README（https://github.com/songxiaopeng529/story-forge）绘制，不是实际应用截图。
