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
 * 计算八字
 * @param {Object} datetime - {year, month, day, hour, minute}
 * @returns {Object} 八字信息
 */
/**
 * 计算大运
 * @param {Object} datetime - 出生时间
 * @returns {Array} 大运数组
 */
function calculateDayun(datetime) {
  const { year, month, day, hour, minute } = datetime;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();
  
  // 获取月柱天干
  const monthGan = bazi.getMonthGan();
  const monthZhi = bazi.getMonthZhi();
  
  // 大运天干顺序
  const ganSequence = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiSequence = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 计算大运起始年龄（从月柱推算）
  let monthGanIndex = ganSequence.indexOf(monthGan);
  let monthZhiIndex = zhiSequence.indexOf(monthZhi);
  
  // 阳干顺推，阴干逆推
  const isYang = monthGanIndex % 2 === 0;
  
  const dayun = [];
  const startAge = 8; // 一般从8岁开始
  
  for (let i = 0; i < 10; i++) {
    const ganIndex = isYang 
      ? (monthGanIndex + i + 1) % 10 
      : (monthGanIndex - i - 1 + 10) % 10;
    const zhiIndex = isYang 
      ? (monthZhiIndex + i + 1) % 12 
      : (monthZhiIndex - i - 1 + 12) % 12;
    
    dayun.push({
      age: startAge + i * 10,
      range: `${startAge + i * 10}-${startAge + (i + 1) * 10 - 1}`,
      gan: ganSequence[ganIndex],
      zhi: zhiSequence[zhiIndex],
      pillar: ganSequence[ganIndex] + zhiSequence[zhiIndex],
      wuxing: WUXING_MAP[ganSequence[ganIndex]]
    });
  }
  
  return dayun;
}

/**
 * 计算流年 (未来100年)
 * @param {Object} datetime - 出生时间
 * @returns {Array} 流年数组
 */
function calculateLiunian(datetime) {
  const { year } = datetime;
  const ganSequence = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiSequence = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const liunian = [];
  
  // 计算从当前年份到100年后的流年
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
 * 生成人生K线图数据
 * @param {Object} datetime - 出生时间
 * @param {Object} baziData - 八字数据
 * @returns {Object} K线图数据
 */
function generateKLinedata(datetime, baziData) {
  const { year: birthYear } = datetime;
  const dayun = calculateDayun(datetime);
  const liunian = calculateLiunian(datetime);
  
  // 计算每个大运的"运势值"
  // 基于五行生克和日主强弱
  const wuxing = baziData.wuxing.percentages;
  const dayZhi = baziData.day.zhi;
  const dayGan = baziData.day.gan;
  
  // 日主五行
  const rizhuWuxing = WUXING_MAP[dayGan];
  
  // 计算每个流年的运势值 (0-100)
  const klineData = liunian.map((ln, index) => {
    let score = 50; // 基础分
    
    // 大运影响
    const currentDayun = dayun.find(d => {
      const [start, end] = d.range.split('-').map(Number);
      return ln.year >= birthYear + start && ln.year <= birthYear + end;
    });
    
    if (currentDayun) {
      // 五行相生加分，相克减分
      const dayunWuxing = currentDayun.wuxing;
      const wuxingRelations = {
        'mu': {'mu': 50, 'huo': 80, 'tu': 60, 'jin': 30, 'shui': 70},
        'huo': {'mu': 70, 'huo': 50, 'tu': 80, 'jin': 30, 'shui': 60},
        'tu': {'mu': 60, 'huo': 70, 'tu': 50, 'jin': 80, 'shui': 30},
        'jin': {'mu': 30, 'huo': 60, 'tu': 70, 'jin': 50, 'shui': 80},
        'shui': {'mu': 80, 'huo': 30, 'tu': 60, 'jin': 70, 'shui': 50}
      };
      
      score = wuxingRelations[rizhuWuxing]?.[dayunWuxing] || 50;
    }
    
    // 添加一些随机波动模拟人生起伏
    const fluctuation = Math.sin(index * 0.3) * 15;
    score = Math.max(10, Math.min(90, score + fluctuation));
    
    return {
      year: ln.year,
      pillar: ln.pillar,
      wuxing: ln.wuxing,
      score: Math.round(score)
    };
  });
  
  return {
    dayun,
    liunian: klineData
  };
}

function calculateBazi(datetime) {
  const { year, month, day, hour, minute } = datetime;
  
  // 创建公历日期对象
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  
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
  
  return {
    year: {
      pillar: yearPillar,
      gan: yearGan,
      zhi: yearZhi,
      ganWuxing: WUXING_MAP[yearGan],
      zhiWuxing: WUXING_MAP[yearZhi]
    },
    month: {
      pillar: monthPillar,
      gan: monthGan,
      zhi: monthZhi,
      ganWuxing: WUXING_MAP[monthGan],
      zhiWuxing: WUXING_MAP[monthZhi]
    },
    day: {
      pillar: dayPillar,
      gan: dayGan,
      zhi: dayZhi,
      ganWuxing: WUXING_MAP[dayGan],
      zhiWuxing: WUXING_MAP[dayZhi],
      isRizhu: true  // 日主标记
    },
    hour: {
      pillar: hourPillar,
      gan: hourGan,
      zhi: hourZhi,
      ganWuxing: WUXING_MAP[hourGan],
      zhiWuxing: WUXING_MAP[hourZhi]
    },
    wuxing: wuxing,
    lunar: {
      year: lunar.getYearInChinese(),
      month: lunar.getMonthInChinese(),
      day: lunar.getDayInChinese()
    },
    solar: {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay()
    }
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
  TIAN_GAN,
  DI_ZHI,
  WUXING_MAP,
  WUXING_NAMES,
  WUXING_COLORS
};
