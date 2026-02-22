const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🔮 天机AI 运行中！');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '天机AI' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔮 天机AI 启动成功，端口: ${PORT}`);
});
