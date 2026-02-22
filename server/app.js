const express = require('express');
const path = require('path');
const { calculateBazi } = require('../utils/bazi');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静态文件
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 首页
app.get('/', (req, res) => {
  res.render('index', { 
    title: '天机AI - 赛博玄学实验室',
    result: null 
  });
});

// 八字计算API
app.post('/api/bazi', (req, res) => {
  try {
    const { year, month, day, hour } = req.body;
    
    if (!year || !month || !day || !hour) {
      return res.status(400).json({ 
        error: '缺少必要参数：年月日时' 
      });
    }

    const result = calculateBazi({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: 0
    });

    res.json(result);
  } catch (error) {
    console.error('计算错误:', error);
    res.status(500).json({ 
      error: '计算失败',
      message: error.message 
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: '天机AI',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔮 天机AI 启动成功`);
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌐 访问地址: http://localhost:${PORT}`);
});
