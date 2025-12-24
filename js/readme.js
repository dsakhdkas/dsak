document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById("readmeContent");
  if (!el) return;

  fetch("../README.md?ts=" + Date.now())
    .then(function (res) {
      if (!res.ok) throw new Error("网络错误");
      return res.text();
    })
    .then(function (text) {
      el.textContent = text;
    })
    .catch(function () {
      el.textContent = "README 加载失败，请稍后重试。";
    });
});
