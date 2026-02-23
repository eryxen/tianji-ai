/**
 * 天机AI - 八字计算核心算法
 * 基于lunar-javascript库实现
 */

const { Lunar, Solar } = require('lunar-javascript');

/**
 * 天干地支数据
 */
const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/**
 * 五行属性映射
 */
const WUXING_MAP = {
  // 天干五行
  '甲': 'mu', '乙': 'mu',
  '丙': 'huo', '丁': 'huo',
  '戊': 'tu', '己': 'tu',
  '庚': 'jin', '辛': 'jin',
  '壬': 'shui', '癸': 'shui',
  
  // 地支五行
  '子': 'shui', '亥': 'shui',
  '寅': 'mu', '卯': 'mu',
  '巳': 'huo', '午': 'huo',
  '申': 'jin', '酉': 'jin',
  '辰': 'tu', '戌': 'tu', '丑': 'tu', '未': 'tu'
};

/**
 * 五行中文名称
 */
const WUXING_NAMES = {
  'mu': '木',
  'huo': '火',
  'tu': '土',
  'jin': '金',
  'shui': '水'
};

/**
 * 五行颜色 (赛博风格)
 */
const WUXING_COLORS = {
  'mu': '#4CAF50',   // 绿色
  'huo': '#F44336',  // 红色
  'tu': '#795548',   // 棕色
  'jin': '#FF9800',  // 橙色
  'shui': '#03A9F4'  // 蓝色
};

/**
 * 天干阴阳属性
 */
const TIAN_GAN_YINYANG = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin'
};

/**
 * 纳音五行表（60甲子）
 */
const NAYIN_MAP = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '砂中金', '乙未': '砂中金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水'
};

/**
 * ===================================
 * 主函数：计算八字
 * ===================================
 * @param {Object} datetime - {year, month, day, hour, minute, gender}
 * @returns {Object} 八字信息
 */
function calculateBazi(datetime) {
  const { year, month, day, hour, minute, gender } = datetime;
  
  // 创建公历日期对象
  const solar = Solar.fromYmdHms(year, month, day, hour, minute || 0, 0);
  
  // 转换为农历
  const lunar = solar.getLunar();
  
  // 获取八字
  const baziArray = lunar.getEightChar();
  
  // 年柱
  const yearGan = baziArray.getYearGan();
  const yearZhi = baziArray.getYearZhi();
  const yearPillar = yearGan + yearZhi;
  
  // 月柱
  const monthGan = baziArray.getMonthGan();
  const monthZhi = baziArray.getMonthZhi();
  const monthPillar = monthGan + monthZhi;
  
  // 日柱
  const dayGan = baziArray.getDayGan();
  const dayZhi = baziArray.getDayZhi();
  const dayPillar = dayGan + dayZhi;
  
  // 时柱
  const hourGan = baziArray.getTimeGan();
  const hourZhi = baziArray.getTimeZhi();
  const hourPillar = hourGan + hourZhi;
  
  // 统计五行
  const wuxing = countWuxing([yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi]);
  
  // 计算十神
  const shiShen = calculateShiShen(dayGan, {
    year: { gan: yearGan, zhi: yearZhi },
    month: { gan: monthGan, zhi: monthZhi },
    day: { gan: dayGan, zhi: dayZhi },
    hour: { gan: hourGan, zhi: hourZhi }
  });
  
  // 判断用神/忌神
  const yongshen = calculateYongshen(dayGan, wuxing);
  
  // 获取纳音
  const nayin = {
    year: NAYIN_MAP[yearPillar] || '未知',
    month: NAYIN_MAP[monthPillar] || '未知',
    day: NAYIN_MAP[dayPillar] || '未知',
    hour: NAYIN_MAP[hourPillar] || '未知'
  };
  
  return {
    year: {
      pillar: yearPillar,
      gan: yearGan,
      zhi: yearZhi,
      ganWuxing: WUXING_MAP[yearGan],
      zhiWuxing: WUXING_MAP[yearZhi],
      nayin: nayin.year
    },
    month: {
      pillar: monthPillar,
      gan: monthGan,
      zhi: monthZhi,
      ganWuxing: WUXING_MAP[monthGan],
      zhiWuxing: WUXING_MAP[monthZhi],
      nayin: nayin.month
    },
    day: {
      pillar: dayPillar,
      gan: dayGan,
      zhi: dayZhi,
      ganWuxing: WUXING_MAP[dayGan],
      zhiWuxing: WUXING_MAP[dayZhi],
      nayin: nayin.day,
      isRizhu: true  // 日主标记
    },
    hour: {
      pillar: hourPillar,
      gan: hourGan,
      zhi: hourZhi,
      ganWuxing: WUXING_MAP[hourGan],
      zhiWuxing: WUXING_MAP[hourZhi],
      nayin: nayin.hour
    },
    wuxing: wuxing,
    shiShen: shiShen,
    yongshen: yongshen,
    lunar: {
      year: lunar.getYearInChinese(),
      month: lunar.getMonthInChinese(),
      day: lunar.getDayInChinese()
    },
    solar: {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: solar.getHour()
    }
  };
}

/**
 * 计算十神
 * @param {string} dayGan - 日主天干
 * @param {Object} pillars - 四柱
 * @returns {Object} 十神关系
 */
function calculateShiShen(dayGan, pillars) {
  const shiShenMap = {
    // 甲日主
    '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '偏官', '辛': '正官', '壬': '偏印', '癸': '正印' },
    // 乙日主
    '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '偏官', '壬': '正印', '癸': '偏印' },
    // 丙日主
    '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '偏官', '癸': '正官' },
    // 丁日主
    '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '偏官' },
    // 戊日主
    '戊': { '甲': '偏官', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
    // 己日主
    '己': { '甲': '正官', '乙': '偏官', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
    // 庚日主
    '庚': { '甲': '偏财', '乙': '正财', '丙': '偏官', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
    // 辛日主
    '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '偏官', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
    // 壬日主
    '壬': { '甲': '偏印', '乙': '正印', '丙': '偏财', '丁': '正财', '戊': '偏官', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
    // 癸日主
    '癸': { '甲': '正印', '乙': '偏印', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '偏官', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
  };
  
  const ganMap = shiShenMap[dayGan] || {};
  
  return {
    year: {
      gan: ganMap[pillars.year.gan] || '未知',
      zhi: '藏干' // 地支藏干计算较复杂，简化处理
    },
    month: {
      gan: ganMap[pillars.month.gan] || '未知',
      zhi: '藏干'
    },
    day: {
      gan: '日主',
      zhi: '藏干'
    },
    hour: {
      gan: ganMap[pillars.hour.gan] || '未知',
      zhi: '藏干'
    }
  };
}

/**
 * 计算用神/忌神（简化版本）
 * @param {string} dayGan - 日主天干
 * @param {Object} wuxing - 五行统计
 * @returns {Object} 用神忌神
 */
function calculateYongshen(dayGan, wuxing) {
  const rizhuWuxing = WUXING_MAP[dayGan];
  const counts = wuxing.count;
  
  // 计算日主强弱（简化：日主五行个数）
  const rizhuCount = counts[rizhuWuxing] || 0;
  const isStrong = rizhuCount >= 3; // 3个及以上算强
  
  // 五行生克关系
  const wuxingRelations = {
    'mu': { sheng: 'huo', ke: 'tu', shengwo: 'shui', kewo: 'jin' },
    'huo': { sheng: 'tu', ke: 'jin', shengwo: 'mu', kewo: 'shui' },
    'tu': { sheng: 'jin', ke: 'shui', shengwo: 'huo', kewo: 'mu' },
    'jin': { sheng: 'shui', ke: 'mu', shengwo: 'tu', kewo: 'huo' },
    'shui': { sheng: 'mu', ke: 'huo', shengwo: 'jin', kewo: 'tu' }
  };
  
  const relation = wuxingRelations[rizhuWuxing];
  
  let yongshen = [];
  let jishen = [];
  
  if (isStrong) {
    // 日主强，用克泄耗
    yongshen.push(WUXING_NAMES[relation.sheng]); // 我生者（食伤，泄）
    yongshen.push(WUXING_NAMES[relation.kewo]); // 克我者（官杀，克）
    jishen.push(WUXING_NAMES[rizhuWuxing]); // 比劫
    jishen.push(WUXING_NAMES[relation.shengwo]); // 生我者（印）
  } else {
    // 日主弱，用生扶
    yongshen.push(WUXING_NAMES[relation.shengwo]); // 生我者（印）
    yongshen.push(WUXING_NAMES[rizhuWuxing]); // 比劫
    jishen.push(WUXING_NAMES[relation.kewo]); // 克我者（官杀）
    jishen.push(WUXING_NAMES[relation.sheng]); // 我生者（食伤）
  }
  
  return {
    rizhuStrength: isStrong ? '身强' : '身弱',
    yongshen: yongshen.join('、'),
    jishen: jishen.join('、'),
    analysis: isStrong 
      ? '日主强旺，需克泄耗，宜官杀、食伤、财星。'
      : '日主衰弱，需生扶，宜印星、比劫助身。'
  };
}

/**
 * 计算大运
 * @param {Object} datetime - 出生时间 {year, month, day, hour, minute, gender}
 * @returns {Array} 大运数组
 */
function calculateDayun(datetime) {
  const { year, month, day, hour, minute, gender } = datetime;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute || 0, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();
  
  // 获取年干和月柱
  const yearGan = bazi.getYearGan();
  const monthGan = bazi.getMonthGan();
  const monthZhi = bazi.getMonthZhi();
  
  // 判断年干阴阳
  const yearGanYinyang = TIAN_GAN_YINYANG[yearGan];
  
  // 确定顺逆（男阳女阴顺排，男阴女阳逆排）
  let isShun = false;
  if (gender === '男' || gender === 'male') {
    isShun = (yearGanYinyang === 'yang');
  } else {
    isShun = (yearGanYinyang === 'yin');
  }
  
  // 大运天干地支序列
  const ganSequence = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiSequence = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  let monthGanIndex = ganSequence.indexOf(monthGan);
  let monthZhiIndex = zhiSequence.indexOf(monthZhi);
  
  const dayun = [];
  
  // 大运起始年龄计算（简化：按节气算，这里用8岁作为基准）
  // 实际应根据出生日与节气的距离计算，这里简化处理
  const startAge = 8;
  
  for (let i = 0; i < 10; i++) {
    let ganIndex, zhiIndex;
    
    if (isShun) {
      // 顺排
      ganIndex = (monthGanIndex + i + 1) % 10;
      zhiIndex = (monthZhiIndex + i + 1) % 12;
    } else {
      // 逆排
      ganIndex = (monthGanIndex - i - 1 + 20) % 10; // +20确保正数
      zhiIndex = (monthZhiIndex - i - 1 + 24) % 12;
    }
    
    const pillar = ganSequence[ganIndex] + zhiSequence[zhiIndex];
    
    dayun.push({
      age: startAge + i * 10,
      range: `${startAge + i * 10}-${startAge + (i + 1) * 10 - 1}`,
      gan: ganSequence[ganIndex],
      zhi: zhiSequence[zhiIndex],
      pillar: pillar,
      wuxing: WUXING_MAP[ganSequence[ganIndex]],
      nayin: NAYIN_MAP[pillar] || '未知'
    });
  }
  
  return dayun;
}

/**
 * 计算流年 (未来80年)
 * @param {Object} datetime - 出生时间
 * @returns {Array} 流年数组
 */
function calculateLiunian(datetime) {
  const { year } = datetime;
  const ganSequence = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiSequence = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const liunian = [];
  
  // 计算从当前年份到80年后的流年
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(year, currentYear - 10); // 从10年前开始
  
  for (let i = 0; i < 80; i++) {
    const y = startYear + i;
    const ganIndex = (y - 4) % 10; // 甲子年=1984
    const zhiIndex = (y - 4) % 12;
    
    liunian.push({
      year: y,
      gan: ganSequence[ganIndex],
      zhi: zhiSequence[zhiIndex],
      pillar: ganSequence[ganIndex] + zhiSequence[zhiIndex],
      wuxing: WUXING_MAP[ganSequence[ganIndex]]
    });
  }
  
  return liunian;
}

/**
 * 生成人生K线图数据（基于五行生克关系）
 * @param {Object} datetime - 出生时间
 * @param {Object} baziData - 八字数据
 * @returns {Object} K线图数据
 */
function generateKLinedata(datetime, baziData) {
  const { year: birthYear } = datetime;
  const dayun = calculateDayun(datetime);
  const liunian = calculateLiunian(datetime);
  
  // 日主天干
  const dayGan = baziData.day.gan;
  const rizhuWuxing = WUXING_MAP[dayGan];
  
  // 五行生克关系分数表
  const wuxingScores = {
    'mu': { 'mu': 50, 'huo': 75, 'tu': 55, 'jin': 30, 'shui': 70 },
    'huo': { 'mu': 70, 'huo': 50, 'tu': 75, 'jin': 55, 'shui': 30 },
    'tu': { 'mu': 30, 'huo': 70, 'tu': 50, 'jin': 75, 'shui': 55 },
    'jin': { 'mu': 55, 'huo': 30, 'tu': 70, 'jin': 50, 'shui': 75 },
    'shui': { 'mu': 75, 'huo': 55, 'tu': 30, 'jin': 70, 'shui': 50 }
  };
  
  // 计算每个流年的运势值
  const klineData = liunian.map((ln) => {
    let score = 50; // 基础分
    
    // 找到当前大运
    const currentDayun = dayun.find(d => {
      const [start, end] = d.range.split('-').map(Number);
      return ln.year >= birthYear + start && ln.year <= birthYear + end;
    });
    
    // 大运五行影响（权重60%）
    if (currentDayun) {
      const dayunWuxing = currentDayun.wuxing;
      const dayunScore = wuxingScores[rizhuWuxing]?.[dayunWuxing] || 50;
      score = dayunScore * 0.6;
    }
    
    // 流年五行影响（权重40%）
    const liunianWuxing = ln.wuxing;
    const liunianScore = wuxingScores[rizhuWuxing]?.[liunianWuxing] || 50;
    score += liunianScore * 0.4;
    
    // 确保分数在10-90之间
    score = Math.max(10, Math.min(90, Math.round(score)));
    
    return {
      year: ln.year,
      pillar: ln.pillar,
      wuxing: ln.wuxing,
      score: score,
      dayun: currentDayun ? currentDayun.pillar : ''
    };
  });
  
  return {
    dayun,
    liunian: klineData
  };
}

/**
 * 统计五行分布
 * @param {Array} characters - 八个字符数组
 * @returns {Object} 五行统计
 */
function countWuxing(characters) {
  const count = {
    mu: 0,
    huo: 0,
    tu: 0,
    jin: 0,
    shui: 0
  };
  
  characters.forEach(char => {
    const wuxing = WUXING_MAP[char];
    if (wuxing) {
      count[wuxing]++;
    }
  });
  
  // 计算百分比
  const total = 8;
  const percentages = {};
  Object.keys(count).forEach(key => {
    percentages[key] = Math.round((count[key] / total) * 100);
  });
  
  return {
    count: count,
    percentages: percentages,
    total: total
  };
}

/**
 * 生成算法步骤说明 (用于展示)
 * @param {Object} datetime
 * @returns {Array} 步骤数组
 */
function generateSteps(datetime) {
  const { year, month, day, hour, minute } = datetime;
  
  return [
    {
      step: 1,
      name: '公历转农历',
      input: `${year}-${month}-${day} ${hour}:${minute}`,
      process: '使用lunar-javascript库进行转换',
      code: `const solar = Solar.fromYmdHms(${year}, ${month}, ${day}, ${hour}, ${minute}, 0);
const lunar = solar.getLunar();`
    },
    {
      step: 2,
      name: '提取八字',
      input: '农历时间',
      process: '根据年月日时提取天干地支',
      code: `const baziArray = lunar.getEightChar();
// 年柱、月柱、日柱、时柱`
    },
    {
      step: 3,
      name: '五行映射',
      input: '八个字符',
      process: '每个天干地支对应一种五行',
      code: `const wuxing = WUXING_MAP[char]; // 木火土金水`
    },
    {
      step: 4,
      name: '统计分析',
      input: '五行数据',
      process: '统计各五行出现次数及百分比',
      code: `count[wuxing]++;
percentages[key] = (count[key] / 8) * 100;`
    }
  ];
}

/**
 * 生成可导出的代码
 * @param {string} language - 'python' 或 'javascript'
 * @returns {string} 代码字符串
 */
function generateExportCode(language = 'python') {
  if (language === 'python') {
    return `# 天机AI - 八字计算算法 (Python版本)
# MIT License

from lunar_python import Solar, Lunar

TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

WUXING_MAP = {
    '甲': 'mu', '乙': 'mu',
    '丙': 'huo', '丁': 'huo',
    '戊': 'tu', '己': 'tu',
    '庚': 'jin', '辛': 'jin',
    '壬': 'shui', '癸': 'shui',
    '子': 'shui', '亥': 'shui',
    '寅': 'mu', '卯': 'mu',
    '巳': 'huo', '午': 'huo',
    '申': 'jin', '酉': 'jin',
    '辰': 'tu', '戌': 'tu', '丑': 'tu', '未': 'tu'
}

def calculate_bazi(year, month, day, hour, minute):
    solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
    bazi = lunar.getEightChar()
    
    result = {
        'year': bazi.getYearGan() + bazi.getYearZhi(),
        'month': bazi.getMonthGan() + bazi.getMonthZhi(),
        'day': bazi.getDayGan() + bazi.getDayZhi(),
        'hour': bazi.getTimeGan() + bazi.getTimeZhi()
    }
    
    return result

# 使用示例
bazi = calculate_bazi(1990, 5, 20, 14, 30)
print(bazi)`;
  } else {
    return `// 天机AI - 八字计算算法 (JavaScript版本)
// MIT License

const { Lunar, Solar } = require('lunar-javascript');

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const WUXING_MAP = {
  '甲': 'mu', '乙': 'mu',
  '丙': 'huo', '丁': 'huo',
  '戊': 'tu', '己': 'tu',
  '庚': 'jin', '辛': 'jin',
  '壬': 'shui', '癸': 'shui',
  '子': 'shui', '亥': 'shui',
  '寅': 'mu', '卯': 'mu',
  '巳': 'huo', '午': 'huo',
  '申': 'jin', '酉': 'jin',
  '辰': 'tu', '戌': 'tu', '丑': 'tu', '未': 'tu'
};

function calculateBazi(datetime) {
  const { year, month, day, hour, minute } = datetime;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();
  
  return {
    year: bazi.getYearGan() + bazi.getYearZhi(),
    month: bazi.getMonthGan() + bazi.getMonthZhi(),
    day: bazi.getDayGan() + bazi.getDayZhi(),
    hour: bazi.getTimeGan() + bazi.getTimeZhi()
  };
}

// 使用示例
const result = calculateBazi({ year: 1990, month: 5, day: 20, hour: 14, minute: 30 });
console.log(result);`;
  }
}

module.exports = {
  calculateBazi,
  countWuxing,
  generateSteps,
  generateExportCode,
  calculateDayun,
  calculateLiunian,
  generateKLinedata,
  calculateShiShen,
  calculateYongshen,
  TIAN_GAN,
  DI_ZHI,
  WUXING_MAP,
  WUXING_NAMES,
  WUXING_COLORS,
  NAYIN_MAP
};
