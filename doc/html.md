# HDU-Lolita爱好站 · HTML 技术说明与小结

本文简要说明本项目中使用到的主要 HTML 相关技术点，方便后续维护与课程查阅。

---

## 1. 页面结构与语义化标签

- 使用 `<!DOCTYPE html>`、`<html lang="zh-CN">` 声明文档类型与语言。
- 头部统一使用：
  - `<meta charset="UTF-8">` 指定 UTF-8 编码。
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 以支持移动端自适应布局。
- 语义化结构：
  - `<header>`：站点顶部导航与 LOGO。
  - `<nav>`：主导航菜单。
  - `<main>`：页面主内容区域（部分页面使用 `<section>` 直接承载主要内容）。
  - `<section>`：按功能分块，如“贩售信息区”“穿搭分享区”等。
  - `<footer>`：页脚版权信息与联系邮箱。

**好处**：提升代码可读性与可维护性，对搜索引擎与无障碍工具更加友好。

---

## 2. 公共头部与导航设计

- 所有页面统一包含顶部导航，方便用户在各功能页之间快速切换：
  - 首页（index.html）
  - 关于 Lolita（pages/about.html）
  - 贩售信息（pages/sales.html）
  - 留言区（pages/message.html）
  - README 说明页（pages/readme.html）
- 导航中使用 `class="active"` 标记当前所在页面，给出视觉反馈。
- 右上角预留 `id="authSlot"` 容器，由 JS 动态填充登录/登出按钮与昵称。

**HTML 要点**：通过统一的 `<header><nav>...</nav></header>` 结构复用导航模板，减少重复设计。

---

## 3. 内容展示相关 HTML 技术

### 3.1 卡片式内容布局

- 使用 `<div class="card">` 作为基本卡片容器，内部包含：
  - `<img>` 展示示例主裙图片。
  - `<p><strong>标题</strong></p>` 显示系列名称。
  - 其他 `<p>` 文本展示品牌、状态等信息。
- 多个卡片放入 `.sales-container`、`.outfits-section` 等父容器中，实现网格式信息展示。

### 3.2 表格（Table）展示贩售信息

- 在 `pages/sales.html` 中使用 `<table>` 展示品牌新品列表：
  - `<thead>`：表头，包含“系列名称 / 品牌 / 定金时间 / 状态 / 详情”五列。
  - `<tbody>`：每一行 `<tr>` 表示一个系列，细节信息通过多个 `<td>` 显示。
- 优势：
  - 表格结构清晰，非常适合展示有多个字段的结构化数据。
  - 搭配 CSS 可以实现响应式滚动（如包在 `.table-wrap` 容器内）。

### 3.3 表单（Form）与表单控件

- 在 `pages/message.html` 中构建了一个留言表单：
  - `<input>` 文本输入（昵称、邮箱）。
  - `<select>` 下拉选择留言主题。
  - `<textarea>` 多行留言内容输入。
  - `<input type="checkbox">` 同意隐私政策勾选框。
  - `<button type="submit">` 提交按钮。
- 使用 HTML 原生验证属性：
  - `required`、`minlength`、`maxlength`、`type="email"` 等，提升表单基础校验能力。

**说明**：当前留言功能仅为演示，不与后端交互，但表单结构完整，可作为后续接入后端的基础。

---

## 4. 媒体与资源引用

- 图片：统一使用 `<img src="..." alt="...">`，提供 `alt` 文本以增强可访问性。
- 图标库：在 `<head>` 中通过 CDN 引入 Font Awesome，配合 `<i class="fa-solid fa-ribbon"></i>` 等类名使用图标。
- CSS 规范化：
  - 通过 `<link>` 引入 `normalize.css`，减少不同浏览器之间的默认样式差异。

---

## 5. README 页面与 Markdown 渲染

### 5.1 HTML 结构

- README 页面使用 `<div id="readmeContent">` 作为容器，不再使用 `<pre>`，以便插入 Markdown 渲染后的 HTML。
- 在页面底部通过 `<script>` 标签按顺序加载：
  1. `marked` 库（CDN）。
  2. 自定义脚本 `js/readme.js`，负责加载并渲染 Markdown。

### 5.2 与 JS 的配合

- HTML 中仅负责留出容器与脚本引用位置，逻辑交给 JS：
  - `fetch('../README.md')` 获取文本内容。
  - 使用 `marked.parse(text)` 将 Markdown 转成 HTML 并写入容器。

**设计思路**：保持 HTML 层简洁，专注结构与语义，将数据获取与渲染交给脚本层实现。

---

## 6. 小结与改进方向

### 6.1 已实现的 HTML 亮点

- 使用语义化标签构建页面骨架，结构清晰。
- 统一的导航与页脚设计，增强了整站的一致性与可维护性。
- 通过表格、卡片、表单等常用 HTML 组件，完成了信息展示、详情查看与简单交互演示。
- README 页面通过 Markdown 渲染，将“开发文档”友好地呈现给普通访客。

### 6.2 后续可优化方向

- 为更多页面补充 `aria-*` 属性，进一步提升无障碍体验。
- 针对手机端和窄屏设备，可以继续细化 HTML 结构配合 CSS 做响应式布局（如折叠菜单、表格横向滚动提示等）。
- 补充更多描述性文案（如图片 `alt` 文本、表单 `placeholder`），让新访客不用查看源码也能快速理解页面用途。

以上为本项目 HTML 相关技术与结构的小结，供后续维护与扩展时参考。
