# Cloudflare Workers AI 穿搭推荐 - 部署指南

本文档说明如何部署 AI 穿搭推荐后端服务。

## 前置要求

- Cloudflare 账号（免费即可）
- 已开通 Workers AI（免费额度：每天 10,000 次调用）

## 部署步骤

### 1. 创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create** → **Create Worker**
4. 给 Worker 命名，如 `hdu-lolita-ai`
5. 点击 **Deploy**

### 2. 编辑代码

1. 部署后点击 **Edit code**
2. 删除默认代码，粘贴 `worker.js` 的全部内容
3. 点击 **Deploy** 保存

### 3. 绑定 AI 模型

1. 返回 Worker 概览页
2. 点击 **Settings** → **Variables**
3. 向下滚动找到 **AI Bindings**
4. 点击 **Add binding**
5. 变量名填写：`AI`
6. 点击 **Deploy**

### 4. 获取 Worker URL

部署完成后，你的 Worker URL 格式如下：
```
https://hdu-lolita-ai.你的用户名.workers.dev
```

### 5. 更新前端配置

打开 `js/ai-stylist.js`，修改第 8 行的 `API_URL`：

```javascript
const API_URL = "https://hdu-lolita-ai.你的用户名.workers.dev/api/stylist";
```

## 测试

1. 用浏览器打开 `pages/ai-stylist.html`
2. 选择风格偏好，点击"生成穿搭建议"
3. 等待 AI 返回结果

## 常见问题

### Q: 提示"AI 服务暂时不可用"？

- 检查 `API_URL` 是否正确
- 确认 Worker 已部署且 AI Binding 已添加
- 打开浏览器开发者工具（F12）查看 Network 错误详情

### Q: 免费额度够用吗？

Cloudflare Workers AI 免费额度：
- 每天 10,000 次神经元调用
- 对于个人项目完全够用

### Q: 想用其他 AI 模型？

可以修改 `worker.js` 中的模型名称。可用模型列表：
- `@cf/meta/llama-3-8b-instruct`（推荐，较快）
- `@cf/meta/llama-3-70b-instruct`（更强，较慢）
- `@cf/mistral/mistral-7b-instruct-v0.1`

## 相关链接

- [Cloudflare Workers AI 文档](https://developers.cloudflare.com/workers-ai/)
- [可用模型列表](https://developers.cloudflare.com/workers-ai/models/)
