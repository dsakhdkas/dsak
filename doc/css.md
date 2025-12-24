# HDU-Lolita爱好站 · CSS 技术说明

本文说明本项目中主要的样式设计思路和关键 CSS 技术点，方便后续维护与课程查阅。

---

## 1. 全局样式与主题变量

### 1.1 CSS 变量（CSS Custom Properties）

在 `:root` 中定义了一组全局主题变量，用于统一颜色和阴影：

- `--pink-50` ~ `--pink-600`：一组粉色系渐变，用于背景、边框、按钮等。
- `--text`、`--muted`：正文颜色与弱化文字颜色。
- `--card`：卡片背景色。
- `--shadow`：按钮与卡片悬浮时的阴影效果。

**好处**：

- 修改主题色时，只需在 `:root` 中改动一处即可全站生效。
- 方便后续支持“主题切换”等高级功能。

### 1.2 基础重置与字体

- 使用 `* { box-sizing: border-box; }` 统一盒模型，避免 padding/border 影响布局计算。
- `body` 设置了：
  - 字体：`'Noto Serif SC','Microsoft YaHei',serif`，兼顾中文显示与整体风格。
  - 背景色：`var(--pink-50)`。
  - 文字颜色：`var(--text)`。
- 链接 `a` 默认继承文本颜色，禁止默认下划线，通过 `:hover` 等状态再添加视觉反馈。

---

## 2. 布局与响应式设计

### 2.1 宽度容器 `.container`

- 使用 `width: min(1100px, 92%)` 将内容区限制在最大宽度 1100px 内，同时在小屏幕时占据 92% 屏幕宽度。
- 配合 `margin: 0 auto;` 实现水平居中，常作为主布局容器使用。

### 2.2 栅格与自适应

- `.grid-2`：
  - 使用 `display: grid; grid-template-columns: 1.25fr .85fr;` 构建两列布局。
  - 通过 `gap: 18px;` 控制列间距，适合“主信息 + 侧栏”场景。
- 媒体查询：
  - `@media (max-width: 900px){ .grid-2{ grid-template-columns: 1fr; } }`
  - 小于 900px 时自动折叠为单列布局，提升移动端体验。

### 2.3 弹性布局（Flexbox）

- 顶部导航 `.header`、导航列表 `nav ul`、卡片容器 `.sales-container` 等大量使用 `display: flex`：
  - `align-items: center;` 垂直居中。
  - `justify-content: space-between / center / flex-end;` 控制对齐方式。
  - `gap` 属性用于控制子元素间距，比使用 margin 更简洁。

---

## 3. 头部、导航与 Banner 样式

### 3.1 顶部头部 `.header`

- 背景色：`var(--pink-100)`，与整体主题色系一致。
- 边框：`border-bottom: 2px solid var(--pink-200);`，与内容区有轻微分隔感。
- 使用 `flex-wrap: wrap;` 保证在小屏宽度下 LOGO 与导航能自动换行。

### 3.2 导航链接样式

- 导航列表 `nav ul` 使用 `flex` 实现水平菜单。
- 每个链接 `nav ul li a`：
  - 通过 `padding` + `border-radius` 制作成“胶囊”按钮效果。
  - `transition: .2s;` 提供悬停时平滑过渡。
  - `:hover` 状态下改变背景与边框颜色以增强交互感。
  - `.active` 类用于标记当前页面，背景色为 `var(--pink-600)`，文字变为白色。

### 3.3 页面顶部横幅 `.page-hero` 与 `.banner`

- `.page-hero`：
  - 使用 `linear-gradient` 做柔和渐变背景。
  - 用 `.page-hero__inner` 控制最大宽度与居中。
  - 标题采用特殊英文字体（如 `'Parisienne'`）增强装饰感。
- `.banner`：
  - 背景图 `img` 使用 `object-fit: cover;` 适应不同屏幕比例。
  - 标题与文案通过 `position: absolute` 居中叠加在图片上。

---

## 4. 卡片、按钮与状态标签

### 4.1 卡片 `.card`

- 样式特点：
  - 固定宽度（约 280px）、圆角、浅阴影，营造“卡片式 UI”。
  - `transition: .2s;` + `:hover { transform: translateY(-3px); }` 实现轻微浮起动效。
- 图片内使用 `object-fit: cover;`，保持内容裁剪后仍然美观。

### 4.2 按钮 `.btn`

- 通用按钮类 `.btn`：
  - `display: inline-flex;` 同时控制对齐与图标文本间距。
  - 使用 `gap`、`border-radius`、`font-weight: 900` 等营造“Lolita 风”按钮样式。
- 变体：
  - `.btn--primary`：主按钮，粉色底 + 白色字，悬停时带阴影和轻微上移。
  - `.btn--ghost`：描边按钮，用于次要操作或返回。
  - `.btn--sm`：缩小版按钮，适合卡片内部使用。

### 4.3 状态标签 `.status` 与 `.badge`

- `.status` 系列用于展示“定金中 / 已结束 / 预告”等销售状态：
  - 不同类：`.status--deposit`、`.status--ended`、`.status--coming` 通过背景色和边框色区分含义。
- `.badge` 用于展示风格标签、额外信息（如 `Classic / Sweet` 等）。

**作用**：通过颜色与形状强化信息层级，辅助用户快速识别重要状态。

---

## 5. 表单样式（留言区）

- `.form__row`：每一行表单项统一设置 `margin`，保持垂直间距一致。
- `.form__label`：独立一行显示标签，并使用粗体增强可读性。
- `.input`（在 CSS 后续部分定义）：
  - 统一了 input / select / textarea 的高度、边框、圆角与内边距。
  - 聚焦时（`:focus`）通常会改变边框颜色，提示当前输入焦点。
- `.checkbox`：通过 `display: flex;` 将勾选框与文字排成一行，并保持合理间距。

**目的**：保持表单 UI 简洁统一，减少不同控件之间的违和感，让用户更容易填写。

---

## 6. 响应式与可用性小结

- 通过 `min()` 函数、`flex-wrap`、`grid` + 媒体查询组合，实现桌面端与移动端均可正常浏览。
- 多数布局采用 `gap` 控制间距，避免多个 margin 嵌套带来的维护复杂度。
- 使用统一的色彩与圆角风格，保证整站观感协调，符合 Lolita 主题的柔和气质。

---

## 7. 后续可优化方向（CSS 视角）

- 针对更小的屏幕增加导航折叠（如汉堡菜单）支持。
- 为 README 页等长文内容补充专门的排版样式（如标题间距、代码块、引用块等）。
- 将常用组件抽象成更系统的“设计系统”，例如按钮、卡片、表单等形成组件库，方便扩展。

以上为本项目 CSS 层面的主要设计与技术小结，供后续维护与扩展参考。
