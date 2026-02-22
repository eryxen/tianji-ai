document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('baziForm');
  const resultSection = document.getElementById('resultSection');
  const resultContent = document.getElementById('resultContent');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 获取表单数据
    const formData = {
      year: parseInt(document.getElementById('year').value),
      month: parseInt(document.getElementById('month').value),
      day: parseInt(document.getElementById('day').value),
      hour: parseInt(document.getElementById('hour').value),
      gender: document.querySelector('input[name="gender"]:checked').value,
      birthplace: document.getElementById('birthplace').value
    };

    // 显示加载状态
    resultSection.style.display = 'block';
    resultContent.innerHTML = '<div class="terminal-line">⏳ 计算中<span class="loading">...</span></div>';

    try {
      // 调用API
      const response = await fetch('/api/bazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('计算失败');
      }

      const result = await response.json();
      displayResult(result);
    } catch (error) {
      resultContent.innerHTML = `
        <div class="terminal-line" style="color: #ff4444;">
          ❌ 错误: ${error.message}
        </div>
      `;
    }
  });

  function displayResult(data) {
    let html = '';

    // 基本信息
    const inputStr = `${data.solar.year}-${data.solar.month}-${data.solar.day} ${data.solar.hour}:00`;
    html += `<div class="terminal-line">📅 出生时间: ${inputStr}</div>`;
    html += `<div class="terminal-line">🌙 农历: ${data.lunar.year}年 ${data.lunar.month}月 ${data.lunar.day}日</div>`;
    html += `<div class="terminal-line">👤 性别: ${data.gender}</div>`;
    html += `<div class="terminal-line">📍 出生地: ${data.birthplace}</div>`;

    // 八字结果 - 从嵌套对象中提取
    const baziArray = [
      data.year.pillar,
      data.month.pillar,
      data.day.pillar,
      data.hour.pillar
    ];
    html += `<div class="bazi-result">🔮 八字: ${baziArray.join(' ')}</div>`;

    // 五行分布
    html += `<div class="terminal-line" style="margin-top: 1.5rem;">📊 五行分布:</div>`;
    html += '<div class="wuxing-chart">';
    
    const wuxing = data.wuxing;
    const elements = ['木', '火', '土', '金', '水'];
    const colors = {
      '木': '#00FF41',
      '火': '#FF4444',
      '土': '#FFD700',
      '金': '#FFFFFF',
      '水': '#00BFFF'
    };

    elements.forEach(elem => {
      const value = wuxing[elem] || 0;
      html += `
        <div class="wuxing-bar">
          <div class="wuxing-label">${elem}</div>
          <div class="wuxing-progress">
            <div class="wuxing-fill" style="width: ${value}%; background: ${colors[elem]};"></div>
          </div>
          <div class="wuxing-value">${value}%</div>
        </div>
      `;
    });

    html += '</div>';

    // 算法步骤
    if (data.steps && data.steps.length > 0) {
      html += `<div class="terminal-line" style="margin-top: 1.5rem;">🔧 算法步骤:</div>`;
      data.steps.forEach((step, index) => {
        html += `<div class="terminal-line" style="margin-left: 1rem;">└─ ${step}</div>`;
      });
    }

    // 代码导出
    if (data.code) {
      html += `
        <div class="terminal-line" style="margin-top: 1.5rem;">
          💾 代码导出:
          <button onclick="copyCode('python')" style="margin-left: 1rem; padding: 0.3rem 0.8rem; background: #9D4EDD; border: none; border-radius: 3px; color: white; cursor: pointer;">复制 Python</button>
          <button onclick="copyCode('javascript')" style="margin-left: 0.5rem; padding: 0.3rem 0.8rem; background: #9D4EDD; border: none; border-radius: 3px; color: white; cursor: pointer;">复制 JS</button>
        </div>
        <pre id="codeBlock" style="display: none;">${JSON.stringify(data.code, null, 2)}</pre>
      `;
    }

    // 大运显示
    if (data.dayun && data.dayun.length > 0) {
      html += `<div class="terminal-line" style="margin-top: 1.5rem;">🚄 大运 (每10年一步):</div>`;
      html += '<div class="dayun-grid">';
      data.dayun.forEach(d => {
        const wuxingColors = {'mu': '#4CAF50', 'huo': '#F44336', 'tu': '#795548', 'jin': '#FF9800', 'shui': '#03A9F4'};
        html += `
          <div class="dayun-item" style="border-left: 3px solid ${wuxingColors[d.wuxing] || '#9D4EDD'};">
            <div class="dayun-age">${d.age}岁</div>
            <div class="dayun-pillar">${d.pillar}</div>
            <div class="dayun-range">${d.range}岁</div>
          </div>
        `;
      });
      html += '</div>';
    }

    // 人生K线图
    if (data.kline && data.kline.liunian) {
      html += `<div class="terminal-line" style="margin-top: 1.5rem;">📈 人生运势K线图:</div>`;
      html += '<div class="kline-chart" id="klineChart">';
      
      // 简化的K线图展示
      const kline = data.kline.liunian;
      const years = kline.map(k => k.year);
      const scores = kline.map(k => k.score);
      
      html += '<div class="kline-bars">';
      kline.forEach((k, i) => {
        const height = k.score;
        const color = k.score >= 60 ? '#00FF41' : (k.score >= 40 ? '#FFD700' : '#FF4444');
        html += `<div class="kline-bar" style="height: ${height}%; background: ${color};" title="${k.year}: ${k.pillar} (${k.score}分)"></div>`;
      });
      html += '</div>';
      
      html += '<div class="kline-labels">';
      html += `<span>${years[0]}</span>`;
      html += `<span>${years[Math.floor(years.length/2)]}</span>`;
      html += `<span>${years[years.length-1]}</span>`;
      html += '</div>';
      
      html += '</div>';
    }

    resultContent.innerHTML = html;

    // 添加打字机效果
    const lines = resultContent.querySelectorAll('.terminal-line');
    lines.forEach((line, index) => {
      line.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // 复制代码到剪贴板
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
