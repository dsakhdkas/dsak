# HDU-Lolita爱好站  JavaScript 技术说明与小结

本文档总结本项目中使用的 JavaScript 技术，适合作为前端入门项目的学习参考。

---

## 一、项目中的 JS 文件

本项目包含两个主要的 JavaScript 文件：

| 文件 | 功能 |
|------|------|
| `js/auth.js` | 实现导航栏的登录/登出功能 |
| `js/products.js` | 管理商品数据和提供工具函数 |

---

## 二、核心技术点

### 2.1 DOM 操作

**什么是 DOM？**

DOM（Document Object Model）是浏览器把 HTML 页面解析成的树形结构，JavaScript 可以通过 DOM 来读取和修改页面内容。

**项目中的使用：**

```javascript
// 通过 id 获取元素
var el = document.getElementById("authSlot");

// 修改元素的 HTML 内容
el.innerHTML = '<button>登录</button>';

// 修改元素的纯文本内容
el.textContent = "你好";
```

### 2.2 事件监听

**什么是事件？**

用户在页面上的操作（如点击、输入）会触发事件，我们可以用 JavaScript 监听这些事件并做出响应。

**项目中的使用：**

```javascript
// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    // 这里的代码会在页面加载完成后运行
});

// 按钮点击事件
button.onclick = function() {
    alert("你点击了按钮");
};
```

### 2.3 本地存储（localStorage）

**什么是 localStorage？**

localStorage 是浏览器提供的本地存储功能，可以在用户电脑上保存数据，关闭浏览器后数据也不会丢失。

**项目中的使用：**

```javascript
// 保存数据
localStorage.setItem("lolita_username", "小明");

// 读取数据
var name = localStorage.getItem("lolita_username");

// 删除数据
localStorage.removeItem("lolita_username");
```

> 注意：localStorage 只能存储字符串，存储对象需要先用 `JSON.stringify()` 转换。

### 2.4 数组方法

**项目中用到的数组方法：**

```javascript
// find() - 查找符合条件的第一个元素
var product = PRODUCTS.find(function(p) {
    return p.id === "starlight-waltz";
});

// forEach() - 遍历数组
tips.forEach(function(tip) {
    console.log(tip);
});
```

### 2.5 对象的使用

**项目中的商品数据结构：**

```javascript
var product = {
    id: "starlight-waltz",
    name: "奥尔奇物商店 OP",
    brand: "仲夏物语",
    price: 499,
    status: "deposit"
};

// 访问对象属性
console.log(product.name);    // "奥尔奇物商店 OP"
console.log(product["price"]); // 499
```

---

## 三、auth.js 详解（登录功能）

### 3.1 功能说明

这个文件实现了一个简单的"登录"功能：
- 用户点击"登录"按钮，输入昵称
- 昵称保存在浏览器的 localStorage 中
- 页面显示用户昵称和"登出"按钮
- 点击"登出"清除保存的昵称

### 3.2 代码结构

```javascript
(function () {
    // 存储昵称的键名
    const KEY = "lolita_username";

    // 渲染函数：根据登录状态显示不同内容
    function render() {
        var slot = document.getElementById("authSlot");
        var name = localStorage.getItem(KEY);

        if (!name) {
            // 未登录：显示登录按钮
            slot.innerHTML = '<button>登录</button>';
        } else {
            // 已登录：显示昵称和登出按钮
            slot.innerHTML = '@' + name + ' <button>登出</button>';
        }
    }

    // 页面加载完成后执行
    document.addEventListener("DOMContentLoaded", render);
})();
```

### 3.3 技术要点

1. **自执行函数** `(function(){ ... })()`
   - 作用：把代码包裹起来，避免变量污染全局
   - 里面定义的变量（如 `KEY`）外部无法访问

2. **prompt() 函数**
   - 弹出输入框，让用户输入内容
   - 返回用户输入的字符串，点取消返回 null

3. **字符串的 trim() 方法**
   - 去除字符串前后的空格
   - 例如：`"  小明  ".trim()` 返回 `"小明"`

---

## 四、products.js 详解（数据管理）

### 4.1 功能说明

这个文件负责：
- 存储所有商品的数据（数组形式）
- 提供根据 id 查找商品的函数
- 提供获取状态标签的函数

### 4.2 数据结构

```javascript
window.PRODUCTS = [
    {
        id: "starlight-waltz",
        name: "奥尔奇物商店 OP",
        brand: "仲夏物语",
        style: "Classic",
        status: "deposit",
        price: 499,
        deposit: "2025/10/20 - 2025/10/25",
        finalPay: "2025/11/05",
        image: "../images/sample-dress.jpg",
        desc: "当猫头鹰的羽翼轻抚过夜色...",
        tips: ["鞋子：棕色玛丽珍", "头饰：同色系女巫帽"],
        recommend: ["classic-melody", "rose-ballet"]
    },
    // ... 更多商品
];
```

### 4.3 工具函数

```javascript
// 根据 id 查找商品
window.getProductById = function(id) {
    return window.PRODUCTS.find(function(p) {
        return p.id === id;
    });
};

// 获取状态的显示文本和样式类名
window.getStatusLabel = function(status) {
    if (status === "deposit") {
        return { text: "定金中", cls: "status--deposit" };
    }
    if (status === "ended") {
        return { text: "已结束", cls: "status--ended" };
    }
    return { text: "预告", cls: "status--coming" };
};
```

### 4.4 为什么挂载到 window？

```javascript
window.PRODUCTS = [...];
window.getProductById = function() {...};
```

- `window` 是浏览器的全局对象
- 挂载到 `window` 上的变量，其他 JS 文件也能访问
- 这样 `sales-detail.html` 页面就能使用 `products.js` 里的数据和函数

---

## 五、页面内联脚本示例

### 5.1 商品详情页的脚本

在 `sales-detail.html` 中，有一段内联的 JavaScript 代码：

```javascript
// 从 URL 获取商品 id
// 例如：sales-detail.html?id=starlight-waltz
var sp = new URLSearchParams(location.search);
var id = sp.get("id");

// 查找商品数据
var product = window.getProductById(id);

// 填充页面内容
document.getElementById("pName").textContent = product.name;
document.getElementById("pPrice").textContent = "￥" + product.price;
```

### 5.2 留言表单的脚本

在 `message.html` 中：

```javascript
document.getElementById("messageForm").addEventListener("submit", function(e) {
    e.preventDefault();  // 阻止表单默认提交
    alert("提交成功（演示）");
    this.reset();        // 重置表单
});
```

---

## 六、常用 JavaScript 技巧总结

### 6.1 字符串拼接

```javascript
// 方式1：+ 号拼接
var html = '<p>' + name + '</p>';

// 方式2：模板字符串（ES6，推荐）
var html = `<p>${name}</p>`;
```

### 6.2 条件判断简写

```javascript
// 完整写法
if (name !== null && name !== undefined && name !== "") {
    // ...
}

// 简写（判断是否有值）
if (name) {
    // ...
}
```

### 6.3 默认值设置

```javascript
// 如果 id 为空，使用默认值
var id = sp.get("id") || "starlight-waltz";
```

---

## 七、小结与收获

通过这个项目，学习和实践了以下 JavaScript 知识：

| 知识点 | 应用场景 |
|--------|----------|
| DOM 操作 | 获取元素、修改内容 |
| 事件监听 | 点击按钮、表单提交、页面加载 |
| localStorage | 保存用户昵称 |
| 数组和对象 | 存储和管理商品数据 |
| 函数封装 | 把重复的逻辑抽成函数复用 |
| URL 参数获取 | 实现商品详情页的动态加载 |

**不足与改进方向：**

1. 目前数据写死在 JS 文件中，可以改为从 JSON 文件或后端 API 获取
2. 没有使用模块化（ES6 Module），文件之间通过 `window` 共享数据
3. 可以学习 Vue/React 等框架，用更现代的方式组织代码

---

以上是本项目 JavaScript 部分的技术说明与小结。
