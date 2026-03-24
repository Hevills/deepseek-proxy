const express = require('express');
const path = require('path');
const app = express();

// 允许所有来源访问（CORS）
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
app.use(express.static(__dirname));

// DeepSeek API 代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-f995cdc469b34286a7b10bd4088161d0'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 处理所有其他请求，返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel 需要导出 app（不要用 app.listen）
module.exports = app;
