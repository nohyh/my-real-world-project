你是我的项目完成助手，你需要跟随我的思路，准确的回答我提出的问题，给出适当的指引和提示。帮助我完成这个项目。
不要启动代码编辑或者直接给我下一步的具体步骤以及详细计划。
---
### 会话上下文 (2025年11月14日)

#### 1. 项目理解
这是一个基于 RealWorld 规范的前后端分离项目。
*   **前端**: 使用 React, Vite, 和 `react-router-dom`。目前正在集成 `react-query` (`@tanstack/react-query`) 来管理服务器状态。前端目前连接的是公开的测试 API (`https://api.realworld.show/api`)。
*   **后端**: 使用 Node.js, Express, 和 Prisma。目前尚未实现业务逻辑，也未与前端连接。
2.项目进度：
前端：正在完成核心逻辑
后端：未开始
---
### 会话日志 (2025年11月18日)

#### 1. 当前进度
*   **问题分析**:
    *   分析了 `Settings` 页面更新后无反应的问题，原因是成功后错误地跳转到了登录页，而不是用户个人资料页。
    *   明确了 `Home` 页面中 "Your Feed" 和 "Global Feed" 的 API 端点 (`/articles/feed` 和 `/articles`)。
    *   澄清了 `/articles/feed` 端点通过请求头中的 JWT Token 识别用户，因此无需在 URL 中传递 `username`。
*   **代码重构讨论**:
    *   深入探讨了如何在 `Home` 页面实现点赞功能。
    *   达成共识：将 `Profile` 页面中的点赞逻辑 (`useMutation`) 抽象成一个可复用的自定义 Hook (e.g., `useLikeArticle`) 是最佳实践。

#### 2. 下一步计划
1.  **重构 Home 页面**:
    *   实现 `Home` 页面的 "Global Feed" 和 "Your Feed" 的文章列表获取逻辑 (`useQuery`)。
    *   在 `Home` 页面中集成并使用 `useLikeArticle` Hook 来实现文章点赞功能。
2.  **修复 Settings Bug**: 修改 `Settings.jsx`，在用户设置更新成功后，应跳转到用户的个人资料页 (`/profile/:username`)。
3. *继续推进动态页面完成

#### 3. 思考与建议
*   **Hook 抽象**: `useLikeArticle` 的实践是一个很好的开始。未来可以继续将其他可复用的逻辑（如关注用户、发表评论、获取标签列表等）封装成自定义 Hooks，这将极大提升代码的可维护性和复用性。
*   **组件状态管理**: 当前 `Home` 页面的组件是静态的。下一步需要将其动态化，通过 `react-query` 来管理加载、错误和数据状态，并渲染从 API 获取的真实数据
*   **后端开发**: 前端核心功能趋于稳定后，应着手后端开发。使用 Express 和 Prisma 实现 `api.yml` 中定义的各个端点，最终替换掉项目当前使用的公共测试 API。

