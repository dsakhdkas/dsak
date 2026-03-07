/**
 * HDU-Lolita AI 穿搭推荐 - Cloudflare Workers
 * 
 * 使用 Cloudflare Workers AI 生成 Lolita 穿搭建议（支持流式响应）
 * 
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard (https://dash.cloudflare.com)
 * 2. 进入 Workers & Pages
 * 3. 创建新 Worker
 * 4. 将此代码粘贴到编辑器中
 * 5. 部署后复制 Worker URL，更新前端 js/ai-stylist.js 中的 API_URL
 * 
 * 注意：需要在 Worker 设置中绑定 AI 模型：
 * - 进入 Worker 设置 -> Variables -> AI Bindings
 * - 添加变量名: AI
 */

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    const url = new URL(request.url);

    // 流式 API 路由
    if (url.pathname === "/api/stylist/stream" && request.method === "POST") {
      return handleStreamRequest(request, env);
    }

    // 普通 API 路由（保留兼容）
    if (url.pathname === "/api/stylist" && request.method === "POST") {
      return handleStylistRequest(request, env);
    }

    // 默认响应
    return new Response(JSON.stringify({ 
      message: "HDU-Lolita AI Stylist API",
      endpoints: {
        "POST /api/stylist": "生成穿搭建议",
        "POST /api/stylist/stream": "流式生成穿搭建议"
      }
    }), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// 系统提示词
const systemPrompt = `你是一位专业的 Lolita 时尚穿搭顾问，精通各种 Lolita 风格（Sweet、Classic、Gothic、Country、Hime、Casual Lolita 等）。

你的任务是根据用户的需求，提供详细、专业且实用的 Lolita 穿搭建议。

请按以下格式回复：

## 整体风格定位
简要描述推荐的整体风格方向

## 主裙推荐
推荐适合的 JSK/OP/SK 类型，包括款式特点、颜色建议

## 搭配单品
- 衬衫/内搭建议
- 头饰建议（发带、发夹、小礼帽等）
- 袜子建议（过膝袜、短袜等）
- 鞋子建议
- 包包建议
- 其他配饰（项链、手套、阳伞等）

## 妆发建议
简要的妆容和发型建议

## 穿搭小贴士
1-2条实用建议

请用亲切、专业的语气回复，适当使用 emoji 增加趣味性。回复控制在 300-400 字左右。`;

// 流式响应处理
async function handleStreamRequest(request, env) {
  try {
    // 检查 AI binding 是否存在
    if (!env.AI) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "AI binding 未配置，请在 Worker Settings -> Variables -> AI Bindings 中添加变量名 AI" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "缺少 prompt 参数" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // 调用 Cloudflare Workers AI（流式）- 使用 Qwen 2.5 模型
    const stream = await env.AI.run("@cf/qwen/qwen2.5-coder-32b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    });

    // 返回流式响应
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        ...corsHeaders
      }
    });

  } catch (err) {
    console.error("AI 流式调用失败:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message || "AI 服务错误",
      details: String(err)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}

// 普通响应处理（兼容旧版）
async function handleStylistRequest(request, env) {
  try {
    // 检查 AI binding 是否存在
    if (!env.AI) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "AI binding 未配置" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "缺少 prompt 参数" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const aiResponse = await env.AI.run("@cf/qwen/qwen2.5-coder-32b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiText = aiResponse.response || aiResponse.result || "";

    return new Response(JSON.stringify({ 
      success: true, 
      data: aiText 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    console.error("AI 调用失败:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message || "AI 服务错误" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
