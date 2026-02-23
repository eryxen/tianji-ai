const express = require('express');
const path = require('path');
const { calculateBazi, calculateDayun, calculateLiunian, generateKLinedata } = require('../utils/bazi');

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// 中间件配置
// ===================================

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静态文件
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ===================================
// 常量定义
// ===================================

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

// ===================================
// 路由
// ===================================

// 首页
app.get('/', (req, res) => {
  res.render('index', { 
    title: '天机 - 赛博玄学',
    result: null 
  });
});

// 八字计算API
app.post('/api/bazi', (req, res) => {
  try {
    const { year, month, day, hour, gender, birthplace } = req.body;
    
    // 参数验证
    if (!year || !month || !day || hour === undefined || hour === '') {
      return res.status(400).json({ 
        success: false,
        error: '缺少必要参数',
        message: '请填写完整的出生年月日时'
      });
    }

    // 转换时辰为小时
    const hourValue = SHICHEN_TO_HOUR[String(hour)] !== undefined 
      ? SHICHEN_TO_HOUR[String(hour)] 
      : parseInt(hour);

    // 构建完整的datetime对象
    const datetime = {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hourValue,
      minute: 0,
      gender: gender || '男' // 默认男性
    };

    // 计算八字
    const baziResult = calculateBazi(datetime);

    // 添加用户输入的附加信息
    baziResult.gender = gender || '未指定';
    baziResult.birthplace = birthplace || '未指定';
    
    // 计算大运（需要性别）
    const dayun = calculateDayun(datetime);
    
    // 生成人生K线图数据
    const klineData = generateKLinedata(datetime, baziResult);
    
    // 组装完整结果
    baziResult.dayun = dayun;
    baziResult.kline = klineData;

    // 返回成功响应
    res.json({
      success: true,
      data: baziResult
    });

  } catch (error) {
    console.error('计算错误:', error);
    res.status(500).json({ 
      success: false,
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

// ===================================
// 错误处理中间件
// ===================================

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '404 Not Found',
    message: `路径 ${req.url} 不存在`
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ===================================
// 启动服务器
// ===================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🔮 天机AI - 赛博玄学系统');
  console.log('='.repeat(50));
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌐 访问地址: http://localhost:${PORT}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('='.repeat(50));
});

module.exports = app;
