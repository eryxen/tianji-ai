document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('baziForm');
  const resultSection = document.getElementById('resultSection');
  const resultContent = document.getElementById('resultContent');

  // ===================================
  // 五行映射（关键bug修复）
  // ===================================
  const WUXING_CN_MAP = {
    'mu': '木',
    'huo': '火',
    'tu': '土',
    'jin': '金',
    'shui': '水'
  };

  const WUXING_COLORS = {
    'mu': '#4CAF50',   // 绿色
    'huo': '#F44336',  // 红色
    'tu': '#795548',   // 棕色
    'jin': '#FF9800',  // 橙色
    'shui': '#03A9F4'  // 蓝色
  };

  // ===================================
  // 表单提交处理
  // ===================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 获取表单数据
    const formData = {
      year: parseInt(document.getElementById('year').value),
      month: parseInt(document.getElementById('month').value),
      day: parseInt(document.getElementById('day').value),
      hour: document.getElementById('hour').value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      birthplace: document.getElementById('birthplace').value
    };

    // 触发粒子加速效果
    if (window.cyberParticles) {
      window.cyberParticles.boost();
    }

    // 显示加载状态
    resultSection.style.display = 'block';
    resultContent.innerHTML = '<div class="terminal-line typing">⏳ 正在计算命盘<span class="loading">...</span></div>';
    resultSection.scrollIntoView({ behavior: 'smooth' });

    try {
      // 调用API
      const response = await fetch('/api/bazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '计算失败');
      }

      displayResult(result.data);
    } catch (error) {
      resultContent.innerHTML = `
        <div class="terminal-line" style="color: #ff4444;">
          ❌ 错误: ${error.message}
        </div>
      `;
    }
  });

  // ===================================
  // 结果展示（带打字机效果）
  // ===================================
  function displayResult(data) {
    let html = '';

    // 基本信息
    html += `<div class="terminal-line typing">📅 出生时间: ${data.solar.year}-${data.solar.month}-${data.solar.day} ${data.solar.hour}:00</div>`;
    html += `<div class="terminal-line typing">🌙 农历: ${data.lunar.year}年 ${data.lunar.month}月 ${data.lunar.day}</div>`;
    html += `<div class="terminal-line typing">👤 性别: ${data.gender}</div>`;
    html += `<div class="terminal-line typing">📍 出生地: ${data.birthplace}</div>`;

    // 八字结果
    const baziArray = [
      data.year.pillar,
      data.month.pillar,
      data.day.pillar,
      data.hour.pillar
    ];
    html += `<div class="bazi-result typing">🔮 八字: ${baziArray.join(' ')}</div>`;

    // 纳音五行
    html += `<div class="terminal-line typing" style="margin-top: 1rem;">🎵 纳音五行:</div>`;
    html += `<div class="terminal-line typing" style="margin-left: 1rem;">年柱: ${data.year.nayin}</div>`;
    html += `<div class="terminal-line typing" style="margin-left: 1rem;">月柱: ${data.month.nayin}</div>`;
    html += `<div class="terminal-line typing" style="margin-left: 1rem;">日柱: ${data.day.nayin} ⭐</div>`;
    html += `<div class="terminal-line typing" style="margin-left: 1rem;">时柱: ${data.hour.nayin}</div>`;

    // 十神显示
    if (data.shiShen) {
      html += `<div class="terminal-line typing" style="margin-top: 1.5rem;">⚔️ 十神关系:</div>`;
      html += `<div class="shishen-grid">`;
      html += `<div class="shishen-item"><span class="label">年干:</span> ${data.shiShen.year.gan}</div>`;
      html += `<div class="shishen-item"><span class="label">月干:</span> ${data.shiShen.month.gan}</div>`;
      html += `<div class="shishen-item current"><span class="label">日主:</span> ${data.shiShen.day.gan}</div>`;
      html += `<div class="shishen-item"><span class="label">时干:</span> ${data.shiShen.hour.gan}</div>`;
      html += `</div>`;
    }

    // 用神/忌神
    if (data.yongshen) {
      html += `<div class="terminal-line typing" style="margin-top: 1.5rem;">🎯 用神分析:</div>`;
      html += `<div class="yongshen-box">`;
      html += `<div class="terminal-line"><strong>日主强弱:</strong> ${data.yongshen.rizhuStrength}</div>`;
      html += `<div class="terminal-line"><strong>用神:</strong> <span style="color: #00FF41;">${data.yongshen.yongshen}</span></div>`;
      html += `<div class="terminal-line"><strong>忌神:</strong> <span style="color: #FF4444;">${data.yongshen.jishen}</span></div>`;
      html += `<div class="terminal-line" style="margin-top: 0.5rem; color: #9D4EDD;">${data.yongshen.analysis}</div>`;
      html += `</div>`;
    }

    // 五行分布（修复bug：使用拼音key读取数据）
    html += `<div class="terminal-line typing" style="margin-top: 1.5rem;">📊 五行分布:</div>`;
    html += '<div class="wuxing-chart">';
    
    const wuxing = data.wuxing.percentages; // 后端返回的是拼音key
    
    // 按顺序：木火土金水
    ['mu', 'huo', 'tu', 'jin', 'shui'].forEach(key => {
      const cnName = WUXING_CN_MAP[key];
      const value = wuxing[key] || 0; // 用拼音key读取
      const color = WUXING_COLORS[key];
      
      html += `
        <div class="wuxing-bar">
          <div class="wuxing-label">${cnName}</div>
          <div class="wuxing-progress">
            <div class="wuxing-fill" style="width: ${value}%; background: ${color};"></div>
          </div>
          <div class="wuxing-value">${value}%</div>
        </div>
      `;
    });

    html += '</div>';

    // 大运显示（标记当前大运）
    if (data.dayun && data.dayun.length > 0) {
      const currentYear = new Date().getFullYear();
      const currentAge = currentYear - data.solar.year;
      
      html += `<div class="terminal-line typing" style="margin-top: 1.5rem;">🚄 大运 (每10年一步):</div>`;
      html += `<div class="terminal-line typing" style="font-size: 0.85rem; color: #9D4EDD;">当前年龄: ${currentAge}岁</div>`;
      html += '<div class="dayun-grid">';
      
      data.dayun.forEach(d => {
        const [start, end] = d.range.split('-').map(Number);
        const isCurrent = currentAge >= start && currentAge <= end;
        const currentClass = isCurrent ? 'current-dayun' : '';
        
        html += `
          <div class="dayun-item ${currentClass}" style="border-left: 3px solid ${WUXING_COLORS[d.wuxing] || '#9D4EDD'};">
            <div class="dayun-age">${d.age}岁</div>
            <div class="dayun-pillar">${d.pillar}</div>
            <div class="dayun-range">${d.range}岁</div>
            ${isCurrent ? '<div class="dayun-current-badge">当前</div>' : ''}
          </div>
        `;
      });
      html += '</div>';
    }

    // 人生K线图（优化tooltip）
    if (data.kline && data.kline.liunian) {
      html += `<div class="terminal-line typing" style="margin-top: 1.5rem;">📈 人生运势K线图:</div>`;
      html += '<div class="kline-chart" id="klineChart">';
      
      const kline = data.kline.liunian;
      const years = kline.map(k => k.year);
      const scores = kline.map(k => k.score);
      
      // K线图柱状图
      html += '<div class="kline-bars">';
      kline.forEach((k, i) => {
        const height = k.score;
        const color = k.score >= 70 ? '#00FF41' : (k.score >= 50 ? '#FFD700' : (k.score >= 30 ? '#FF9800' : '#FF4444'));
        html += `
          <div class="kline-bar" 
               style="height: ${height}%; background: ${color};" 
               data-year="${k.year}"
               data-pillar="${k.pillar}"
               data-score="${k.score}"
               data-dayun="${k.dayun || ''}">
          </div>
        `;
      });
      html += '</div>';
      
      // 年份标签
      html += '<div class="kline-labels">';
      html += `<span>${years[0]}</span>`;
      html += `<span>${years[Math.floor(years.length/2)]}</span>`;
      html += `<span>${years[years.length-1]}</span>`;
      html += '</div>';
      
      // 图例
      html += '<div class="kline-legend">';
      html += '<div class="kline-legend-item"><div class="kline-legend-color" style="background: #00FF41;"></div><span>优 (70+)</span></div>';
      html += '<div class="kline-legend-item"><div class="kline-legend-color" style="background: #FFD700;"></div><span>良 (50-69)</span></div>';
      html += '<div class="kline-legend-item"><div class="kline-legend-color" style="background: #FF9800;"></div><span>中 (30-49)</span></div>';
      html += '<div class="kline-legend-item"><div class="kline-legend-color" style="background: #FF4444;"></div><span>弱 (<30)</span></div>';
      html += '</div>';
      
      html += '</div>';
    }

    // tooltip容器
    html += '<div id="klineTooltip" class="kline-tooltip" style="display: none;"></div>';

    resultContent.innerHTML = html;

    // 添加打字机效果（渐入动画）
    const typingElements = resultContent.querySelectorAll('.typing');
    typingElements.forEach((elem, index) => {
      elem.style.animationDelay = `${index * 0.05}s`;
    });

    // K线图tooltip交互
    addKlineTooltip();
  }

  // ===================================
  // K线图tooltip功能
  // ===================================
  function addKlineTooltip() {
    const tooltip = document.getElementById('klineTooltip');
    if (!tooltip) return;

    const bars = document.querySelectorAll('.kline-bar');
    
    bars.forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        const year = bar.dataset.year;
        const pillar = bar.dataset.pillar;
        const score = bar.dataset.score;
        const dayun = bar.dataset.dayun;
        
        tooltip.innerHTML = `
          <div><strong>${year}年</strong></div>
          <div>流年: ${pillar}</div>
          ${dayun ? `<div>大运: ${dayun}</div>` : ''}
          <div>运势: ${score}分</div>
        `;
        
        tooltip.style.display = 'block';
        
        // 定位tooltip
        const rect = bar.getBoundingClientRect();
        const chartRect = bar.parentElement.getBoundingClientRect();
        tooltip.style.left = (rect.left - chartRect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - chartRect.top - 10) + 'px';
      });
      
      bar.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  // ===================================
  // 代码复制功能
  // ===================================
  window.copyCode = function(lang) {
    const codeBlock = document.getElementById('codeBlock');
    const codeData = JSON.parse(codeBlock.textContent);
    const code = codeData[lang] || '代码不可用';

    navigator.clipboard.writeText(code).then(() => {
      alert(`✅ ${lang} 代码已复制到剪贴板`);
    }).catch(() => {
      alert('❌ 复制失败，请手动复制');
    });
  };
});
