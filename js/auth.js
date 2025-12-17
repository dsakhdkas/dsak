(function () {
  const KEY = "lolita_username";

  function render() {
    const slot = document.getElementById("authSlot");
    if (!slot) return;

    const name = localStorage.getItem(KEY);

    if (!name) {
      slot.innerHTML = `<button class="nav-btn" id="loginBtn">登录</button>`;
      document.getElementById("loginBtn").onclick = () => {
        const v = (prompt("请输入昵称：") || "").trim();
        if (!v) return;
        localStorage.setItem(KEY, v);
        render();
      };
    } else {
      slot.innerHTML = `
        <span class="nav-user">@${name}</span>
        <button class="nav-btn" id="logoutBtn">登出</button>
      `;
      document.getElementById("logoutBtn").onclick = () => {
        localStorage.removeItem(KEY);
        render();
      };
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();