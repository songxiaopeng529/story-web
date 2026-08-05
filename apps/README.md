# Applications

`apps/` 存放可独立运行和部署的用户界面应用。

- `web`：面向访客的 Next.js 个人网站。
- `admin`：未来如需后台管理界面再创建，不在 V1 提前占位实现。

应用可以依赖 `packages/` 中的共享包，但应用之间不能直接互相 import。
