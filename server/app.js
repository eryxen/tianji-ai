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

// 十二时辰到小时的映射
const SHICHEN_TO_HOUR = {
  '0': 23,   // 子时 (23:00-00:59)
  '1': 1,    // 丑时
  '2': 3,    // 寅时
  '3': 5,    // 卯时
  '4': 7,    // 辰时
  '5': 9,    // 巳时
  '6': 11,   // 午时
  '7': 13,   // 未时
  '8': 15,   // 申时
  '9': 17,   // 酉时
  '10': 19,  // 戌时
  '11': 21,  // 亥时
  '12': 0,   // 早子时
  '13': 23   // 晚子时
};

// 八字计算API
app.post('/api/bazi', (req, res) => {
  try {
    const { year, month, day, hour, gender, birthplace } = req.body;
    
    if (!year || !month || !day || hour === undefined || hour === '') {
      return res.status(400).json({ 
        error: '缺少必要参数：年月日时' 
      });
    }

    // 转换时辰为小时
    const hourValue = SHICHEN_TO_HOUR[String(hour)] !== undefined 
      ? SHICHEN_TO_HOUR[String(hour)] 
      : parseInt(hour);

    const result = calculateBazi({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hourValue,
      minute: 0
    });

    // 添加用户输入的附加信息
    result.gender = gender || '未指定';
    result.birthplace = birthplace || '未指定';

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
