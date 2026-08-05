# Shared packages

`packages/` 存放多个应用或工具真正需要复用的前端/TypeScript 能力，例如：

- `content`：Markdown/MDX schema、索引和内容读取能力。
- `ui`：未来网站与管理后台共用的基础 UI。
- `typescript-config`、`eslint-config`：出现第二个 TypeScript 应用后再抽取。

V1 不为尚未出现的复用场景创建空包；共享代码首先留在消费方，出现第二个消费者时再迁入这里。
