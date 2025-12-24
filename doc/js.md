# HDU-Lolita爱好站 · JavaScript 技术说明

本文说明本项目中使用到的主要 JavaScript 功能模块与实现思路，包括数据管理、登录昵称演示、README 渲染等。

---

## 1. 脚本文件概览

目前项目主要包含以下 JS 文件：

- `js/auth.js`：负责导航栏右侧的昵称登录/登出演示。
- `js/products.js`：集中管理示例贩售商品数据与状态标签工具函数。
- `js/readme.js`：负责加载根目录下的 `README.md` 并在 README 页面中进行 Markdown 渲染。

---

## 2. 登录昵称演示逻辑（auth.js）

### 2.1 模块结构

`auth.js` 使用了一个自执行匿名函数：

```js
(function () {
  // 内部变量与函数
})();
```

好处：

- 避免将内部变量泄漏到全局作用域，减少命名冲突。

### 2.2 本地存储键与渲染函数

- 通过常量 `KEY = "lolita_username"` 定义 localStorage 中存储昵称的键名。
- `render()` 函数负责根据当前登录状态更新导航栏右侧的内容：
  - 通过 `document.getElementById("authSlot")` 获取占位容器。
  - 使用 `localStorage.getItem(KEY)` 读取昵称。

### 2.3 登录 / 登出交互

- 未登录时：
  - 在 `authSlot` 中插入一个“登录”按钮。
  - 绑定点击事件：
    - 使用 `prompt("请输入昵称：")` 请求用户输入。
    - 去除前后空格后，如果不为空，则 `localStorage.setItem(KEY, v)` 保存昵称，并重新调用 `render()` 刷新导航栏。
- 已登录时：
  - 在 `authSlot` 中展示 `@昵称` 和一个“登出”按钮。
  - 点击“登出”后，通过 `localStorage.removeItem(KEY)` 清除本地昵称，再次调用 `render()` 恢复为未登录状态。

### 2.4 事件绑定时机

- 使用 `document.addEventListener("DOMContentLoaded", render);`
- 确保在 DOM 加载完成后再尝试获取 `authSlot` 元素，避免空引用问题。

**说明**：

该模块仅作“轻量登录”演示，不涉及真实账号体系，也不会与服务器通信。

---

## 3. 商品数据与状态工具（products.js）

### 3.1 PRODUCTS 数据结构

- 通过 `window.PRODUCTS = [ ... ]` 在全局定义一个商品数组，每个元素为一个对象，字段包括：
  - `id`：唯一标识字符串（如 `"starlight-waltz"`）。
  - `name`：系列名称。
  - `brand`：品牌名。
  - `style`：风格标签（如 `Classic`、`Sweet`）。
  - `status`：销售状态（`deposit` / `ended` / `coming`）。
  - `price`：价格（示例数值）。
  - `deposit`、`finalPay`：定金时间与尾款时间。
  - `image`：图片路径。
  - `desc`：简介文字。
  - `tips`：数组，存放搭配建议的多行文案。
  - `recommend`：数组，存放“你可能也喜欢”的其他商品 id。

**用途**：

- 为贩售信息列表页与商品详情页提供数据源，展示结构化信息。

### 3.2 获取商品与状态文本

- `window.getProductById = function(id){ ... }`
  - 使用 `Array.prototype.find` 在 `PRODUCTS` 中查找指定 id 的商品对象。
  - 返回匹配的商品或 `undefined`。

- `window.getStatusLabel = function(status){ ... }`
  - 根据传入的状态字符串，返回对应标签文案与 CSS 类名：
    - `deposit` → `{ text: "定金中", cls: "status--deposit" }`
    - `ended` → `{ text: "已结束", cls: "status--ended" }`
    - 其他 → `{ text: "预告", cls: "status--coming" }`

**优点**：

- 状态文案与样式类集中在一个函数中管理，当需要调整显示文字或颜色时，只需修改这一处即可。

### 3.3 在页面中的典型用法（示意）

以商品详情页为例（逻辑在 `pages/sales-detail.html` 内联脚本中）：

- 通过 `URLSearchParams` 从 `location.search` 获取 `id`。
- 调用 `getProductById(id)` 获取对应商品对象。
- 调用 `getStatusLabel(p.status)` 获取状态文案与类名，并设置到 `.status` 标签上。
- 遍历 `p.tips` 数组，动态创建 `<li>` 元素，填充搭配建议列表。
- 遍历 `p.recommend`，再次通过 `getProductById` 获取推荐商品，生成“你可能也喜欢”的卡片。

---

## 4. README 加载与 Markdown 渲染（readme.js）

### 4.1 基本流程

`readme.js` 主要负责：

1. 等待 DOM 加载。
2. 找到 README 容器元素 `#readmeContent`。
3. 使用 `fetch('../README.md?ts=' + Date.now())` 获取最新的 README 文本。
4. 调用 `marked` 库将 Markdown 文本转换为 HTML，插入到页面中。

### 4.2 关键代码说明

```js
document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById("readmeContent");
  if (!el) return;

  fetch("../README.md?ts=" + Date.now())
    .then(function (res) {
      if (!res.ok) throw new Error("网络错误");
      return res.text();
    })
    .then(function (text) {
      try {
        if (window.marked && typeof window.marked.parse === "function") {
          el.innerHTML = window.marked.parse(text);
        } else if (window.marked && typeof window.marked === "function") {
          // 兼容旧版 marked
          el.innerHTML = window.marked(text);
        } else {
          el.textContent = text;
        }
      } catch (e) {
        el.textContent = text;
      }
    })
    .catch(function () {
      el.textContent = "README 加载失败，请稍后重试。";
    });
});
```

- 使用 `?ts=` + 时间戳 避免部分浏览器的缓存问题，确保看到 README 最新内容。
- 对 `marked` 的新旧 API 做了兼容处理：
  - 新版：`marked.parse(text)`。
  - 旧版：`marked(text)`。
- 如果渲染过程中出错或未成功加载 `marked`，会回退为 `textContent` 纯文本显示，保证页面不会空白。

---

## 5. 其他脚本与增强方向

### 5.1 内联脚本示例

- 在留言页中，使用了简单的内联脚本：
  - 拦截表单 `submit` 事件，调用 `preventDefault()` 阻止真实提交。
  - 弹出“提交成功（演示）”的提示，并重置表单。
- 该部分主要用于演示前端表单交互流程，后续可替换为独立 JS 文件并接入后端。

### 5.2 可改进方向

- 将页面内联脚本逐步拆分到独立 JS 文件中，进一步清晰模块边界。
- 增加基础错误提示 UI（而不仅仅是 `alert`），提高用户体验。
- 补充简单路由或状态管理（例如按状态筛选贩售信息），展示更丰富的前端交互能力。

---

以上为本项目 JavaScript 部分的主要技术说明，涵盖了登录演示、数据管理与 Markdown 渲染等核心逻辑，便于后续复查与扩展。
