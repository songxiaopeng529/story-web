# Backend services

`services/` 为未来可独立部署的后端服务预留，允许使用 Go、Java 或其他语言。

服务目录按业务职责命名，不按实现语言命名。每个服务保持自己的原生工程边界，例如一个 Go 实现的内容服务可以是：

```text
services/content-api/
├── go.mod
├── cmd/
├── internal/
├── Dockerfile
└── README.md
```

同一个服务如果选择 Java，则目录仍叫 `services/content-api`，内部结构可以是：

```text
services/content-api/
├── build.gradle.kts
├── src/
├── Dockerfile
└── README.md
```

约束：

- 服务之间通过明确的 HTTP/RPC/事件契约通信，不跨目录 import 源代码。
- OpenAPI、JSON Schema 或 Protobuf 等跨语言契约放入未来的仓库级 `contracts/`。
- Go/Java 服务继续使用各自的原生构建工具；pnpm 与 Turborepo 只负责 JavaScript/TypeScript 工作区。
- CI 按路径和语言拆分，Web 与后端服务可以独立构建、测试和部署。
