/**
 * AI 穿搭推荐 - 前端脚本
 * 收集用户需求并调用 Cloudflare Workers API（支持流式响应）
 */

(function () {
  // ⚠️ 部署后请替换为你的 Cloudflare Workers URL
  const API_URL = "https://hdu-lolita.yue47599.workers.dev/api/stylist/stream";

  const form = document.getElementById("aiForm");
  const submitBtn = document.getElementById("submitBtn");
  const resultPanel = document.getElementById("resultPanel");
  const aiResult = document.getElementById("aiResult");

  // 风格映射（中文）
  const styleMap = {
    sweet: "Sweet（甜系）",
    classic: "Classic（古典）",
    gothic: "Gothic（哥特）",
    country: "Country（田园）",
    hime: "Hime（公主）",
    casual: "Casual Lolita（日常）",
  };

  const occasionMap = {
    daily: "日常外出",
    "tea-party": "茶会聚会",
    photo: "拍照",
    concert: "音乐会/演出",
    date: "约会",
  };

  const seasonMap = {
    spring: "春季",
    summer: "夏季",
    autumn: "秋季",
    winter: "冬季",
  };

  const budgetMap = {
    low: "500元以下",
    mid: "500-1500元",
    high: "1500-3000元",
    premium: "3000元以上",
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      style: formData.get("style"),
      occasion: formData.get("occasion"),
      season: formData.get("season"),
      color: formData.get("color"),
      budget: formData.get("budget"),
      extra: formData.get("extra"),
    };

    // 构建用户需求描述
    let prompt = `请用中文为我推荐一套 Lolita 穿搭方案，按照下面的要求，不要混淆汉元素、JK、普通洋装，注意场景和预算
避免不协调搭配。\n`;
    prompt += `风格偏好：${styleMap[data.style] || data.style}\n`;

    if (data.occasion) {
      prompt += `场合：${occasionMap[data.occasion]}\n`;
    }
    if (data.season) {
      prompt += `季节：${seasonMap[data.season]}\n`;
    }
    if (data.color) {
      prompt += `颜色偏好：${data.color}\n`;
    }
    if (data.budget) {
      prompt += `预算范围：${budgetMap[data.budget]}\n`;
    }
    if (data.extra) {
      prompt += `其他要求：${data.extra}\n`;
    }

    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI 思考中...';
    resultPanel.style.display = "block";
    aiResult.innerHTML = `<div class="ai-text"><p></p></div>`;

    let fullText = "";
    const textContainer = aiResult.querySelector("p");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      // 流式读取响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // 解析 SSE 格式的数据
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const json = JSON.parse(data);
              if (json.response) {
                fullText += json.response;
                // 实时更新显示（简单格式化）
                textContainer.innerHTML = formatAIResponseLive(fullText);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 最终格式化
      if (fullText) {
        aiResult.innerHTML = formatAIResponse(fullText);
      } else {
        throw new Error("AI 未返回内容");
      }
    } catch (err) {
      console.error("AI 请求失败:", err);
      aiResult.innerHTML = `
        <div class="ai-error">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>抱歉，AI 服务暂时不可用</p>
          <p class="muted">${err.message}</p>
          <p class="muted" style="margin-top:12px;">
            提示：请确保已部署 Cloudflare Workers 并更新 API_URL
          </p>
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 生成穿搭建议';
    }
  });

  /**
   * 实时格式化（简单处理，保持流畅）
   */
  function formatAIResponseLive(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  }

  /**
   * 格式化 AI 返回的文本为 HTML
   */
  function formatAIResponse(text) {
    // 转义 HTML
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 处理标题（## 或 **标题**）
    html = html.replace(/^##\s*(.+)$/gm, '<h3 class="ai-heading">$1</h3>');
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // 处理列表项
    html = html.replace(/^[-•]\s*(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="ai-list">$&</ul>');

    // 处理换行
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    return `<div class="ai-text"><p>${html}</p></div>`;
  }
})();
