const express = require('express');
const path = require('path');
const app = express();

// CORS 中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DeepSeek API 代理端点
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到请求:', req.body.messages?.slice(-1));
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-f995cdc469b34286a7b10bd4088161d0'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: req.body.messages,
        temperature: req.body.temperature || 0.7,
        max_tokens: req.body.max_tokens || 1000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API 错误:', response.status, errorText);
      return res.status(response.status).json({ error: `API错误: ${response.status}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 根路径返回 HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>DeepSeek Proxy</title></head>
    <body>
      <h1>DeepSeek Proxy 服务运行中</h1>
      <p>API 端点: <code>/api/chat</code></p>
      <p>请访问您的心理辅导页面。</p>
    </body>
    </html>
  `);
});

// 导出给 Vercel
module.exports = app;
