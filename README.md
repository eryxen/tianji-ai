# 天机AI - 赛博玄学实验室 🔮

> **代码即命运，算法即天机**  
> Cyber Divination Lab - Where Ancient Wisdom Meets Modern AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-MVP-blue)](https://github.com/eryxen/tianji-ai)

---

## 🌟 这是什么？

**天机AI** 是一个将中国传统命理学（八字、五行）与现代 AI 技术结合的开源项目。

**不同于传统算命工具，我们：**
- ✅ **算法透明** - 展示每一步计算过程
- ✅ **代码开源** - 核心算法完全公开
- ✅ **AI 增强** - 使用 Claude AI 生成现代化解读
- ✅ **赛博美学** - Terminal 风格界面，程序员友好
- ✅ **科学态度** - 结合心理学和统计学思维

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/eryxen/tianji-ai.git
cd tianji-ai
npm install
```

### 运行测试

```bash
node test.js
```

### 示例代码

```javascript
const { calculateBazi } = require('./utils/bazi');

const result = calculateBazi({
  year: 1990,
  month: 5,
  day: 20,
  hour: 14,
  minute: 30
});

console.log(result);
// 输出: 庚午 辛巳 乙酉 癸未
```

---

## 📊 功能特性

### 已完成 ✅
- [x] 八字计算引擎
- [x] 五行分布统计
- [x] 算法步骤可视化
- [x] Python/JavaScript 代码导出

### 开发中 🚧
- [ ] AI 解读引擎 (Claude API)
- [ ] 赛博朋克风格界面
- [ ] Web 应用部署
- [ ] PDF 报告导出

### 计划中 📋
- [ ] 姓名学分析
- [ ] 奇门遁甲排盘
- [ ] 紫微斗数
- [ ] API 服务

---

## 🎨 设计理念

### 赛博玄学 = 玄学 × 科技

我们相信：
1. **传统命理学有其统计学价值** - 基于数千年的观察总结
2. **AI 可以提供现代化解读** - 结合心理学和性格类型论
3. **算法应该透明** - 不做黑盒，可验证、可学习
4. **命运在自己手中** - 工具只是参考，不是决定

### 界面风格

```
┌─────────────────────────────────────┐
│ 天机AI - CYBER DIVINATION LAB       │
│ Tianji AI v1.0                      │
├─────────────────────────────────────┤
│ $ tianji.calculate("八字")          │
│ > 正在初始化算法...                  │
│ > 计算四柱八字... [完成]             │
│ > 统计五行分布... [完成]             │
│                                     │
│ 结果: 庚午 辛巳 乙酉 癸未             │
│ 五行: 木13% 火25% 土13% 金38% 水13%  │
└─────────────────────────────────────┘
```

---

## 🛠️ 技术栈

- **语言**: Node.js / JavaScript
- **核心库**: [lunar-javascript](https://github.com/6tail/lunar-javascript) - 农历计算
- **AI**: Claude Sonnet 4 (可选)
- **前端**: HTML + CSS + Vanilla JS (无框架)
- **部署**: Zeabur / Vercel

---

## 📖 算法说明

### 八字计算流程

```
1. 输入公历时间
   ↓
2. 转换为农历
   ↓
3. 提取年月日时四柱
   ↓
4. 映射天干地支五行
   ↓
5. 统计五行分布
   ↓
6. AI 生成解读
```

### 五行对应

| 五行 | 天干 | 地支 | 颜色 |
|------|------|------|------|
| 木 | 甲乙 | 寅卯 | 绿 |
| 火 | 丙丁 | 巳午 | 红 |
| 土 | 戊己 | 辰戌丑未 | 棕 |
| 金 | 庚辛 | 申酉 | 橙 |
| 水 | 壬癸 | 亥子 | 蓝 |

---

## 🔐 隐私声明

- ✅ 不保存用户数据
- ✅ 不建立账号系统
- ✅ 所有计算本地完成
- ✅ AI 调用匿名化

---

## 📚 参考资料

### 经典文献
- 《滴天髓》
- 《穷通宝鉴》
- 《子平真诠》

### 现代解释
- 心理学角度: 性格类型论
- 统计学角度: 出生时间与性格相关性
- 社会学角度: 文化符号的心理暗示

---

## 🤝 贡献

欢迎提交 PR！

**开发计划:**
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

MIT License - 自由使用、修改、分发

**注意:** 
- 算法部分完全开源 (MIT)
- AI 解读需要自行配置 API Key
- 仅供学习、娱乐、参考

---

## ⚠️ 免责声明

1. 本工具仅供娱乐和参考，不构成任何专业建议
2. 命运掌握在自己手中，算法只是辅助工具
3. 重大决策请咨询专业人士
4. AI 解读基于概率统计，非绝对准确
5. 本项目不承担任何因使用本工具产生的后果

**算法开源 · 结果仅供参考 · 理性对待**

---

## 💬 联系方式

- **作者**: Xen (@Xen_AI_Lab)
- **项目主页**: https://github.com/eryxen/tianji-ai
- **问题反馈**: [Issues](https://github.com/eryxen/tianji-ai/issues)

---

## 🌟 Star History

如果这个项目对你有帮助，请给个 ⭐ Star！

---

**Made with ❤️ by Xen + Lycan**

*当玄学遇上 AI，代码即是天机*
