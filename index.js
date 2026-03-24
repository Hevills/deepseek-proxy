const express = require('express');
const path = require('path');
const app = express();

// 最简单的响应
app.get('/', (req, res) => {
  res.send('Hello from DeepSeek Proxy! The server is running.');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// DeepSeek API 代理
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求');
    
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
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 导出给 Vercel
module.exports = app;
