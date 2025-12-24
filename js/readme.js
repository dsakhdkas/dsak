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
          // 兜底：如果没有加载到 marked，就按纯文本显示
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
