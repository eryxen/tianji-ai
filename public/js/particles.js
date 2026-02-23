/**
 * 天机AI - 赛博粒子背景系统
 * 纯Canvas实现，无第三方依赖
 */

class CyberParticles {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.colors = ['#9D4EDD', '#00FF41']; // 赛博紫 + 矩阵绿
    this.animationId = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 性能参数
    this.particleCount = this.isMobile ? 40 : 80;
    this.connectionDistance = 150;
    this.mouseInteractionRadius = 150;
    
    // 动画状态
    this.isAnimating = !this.isReducedMotion;
    this.boostMode = false; // 用于八字计算时的加速效果
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    
    // 事件监听
    window.addEventListener('resize', () => this.resizeCanvas());
    
    if (!this.isReducedMotion) {
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    
    // 监听动作偏好变化
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.isAnimating = !e.matches;
      if (!this.isAnimating && this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      } else if (this.isAnimating && !this.animationId) {
        this.animate();
      }
    });
    
    // 开始动画
    if (this.isAnimating) {
      this.animate();
    } else {
      // 静态渲染一帧
      this.render();
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // 重新调整粒子位置
    this.particles.forEach(p => {
      if (p.x > this.canvas.width) p.x = this.canvas.width;
      if (p.y > this.canvas.height) p.y = this.canvas.height;
    });
  }

  createParticles() {
    this.particles = [];
    
    // 计算标题区域（增加粒子密度）
    const titleZone = {
      x: this.canvas.width / 2,
      y: 100,
      radius: 200
    };
    
    for (let i = 0; i < this.particleCount; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      // 30%的粒子集中在标题附近
      const inTitleZone = Math.random() < 0.3;
      let x, y;
      
      if (inTitleZone) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * titleZone.radius;
        x = titleZone.x + Math.cos(angle) * distance;
        y = titleZone.y + Math.sin(angle) * distance;
      } else {
        x = Math.random() * this.canvas.width;
        y = Math.random() * this.canvas.height;
      }
      
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.3, // 缓慢漂移
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2, // 2-5px
        color: color,
        opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
        glowSize: Math.random() * 5 + 3
      });
    }
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleMouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  // 粒子更新逻辑
  updateParticles() {
    const speedMultiplier = this.boostMode ? 3 : 1;
    
    this.particles.forEach(particle => {
      // 基础移动
      particle.x += particle.vx * speedMultiplier;
      particle.y += particle.vy * speedMultiplier;
      
      // 边界反弹
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      }
      
      // 鼠标交互（轻微吸引/排斥）
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouseInteractionRadius) {
          const force = (this.mouseInteractionRadius - distance) / this.mouseInteractionRadius;
          const angle = Math.atan2(dy, dx);
          
          // 根据粒子颜色决定吸引或排斥
          const direction = particle.color === '#9D4EDD' ? -1 : 1; // 紫色排斥，绿色吸引
          particle.vx += Math.cos(angle) * force * 0.05 * direction;
          particle.vy += Math.sin(angle) * force * 0.05 * direction;
        }
      }
      
      // 速度衰减（避免无限加速）
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // 确保最小速度
      if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.05;
      if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.05;
    });
  }

  // 绘制连线
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(157, 78, 221, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  // 绘制粒子
  drawParticles() {
    this.particles.forEach(particle => {
      // 发光效果
      this.ctx.shadowBlur = particle.glowSize;
      this.ctx.shadowColor = particle.color;
      
      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // 重置阴影
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    });
  }

  // 渲染一帧
  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制连线
    this.drawConnections();
    
    // 绘制粒子
    this.drawParticles();
  }

  // 动画循环
  animate() {
    if (this.isAnimating) {
      this.updateParticles();
      this.render();
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  // 公开方法：触发加速效果（八字计算时调用）
  boost() {
    if (this.isReducedMotion) return;
    
    this.boostMode = true;
    
    // 粒子短暂向中心聚合
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles.forEach(particle => {
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      particle.vx += Math.cos(angle) * 0.5;
      particle.vy += Math.sin(angle) * 0.5;
    });
    
    // 0.5秒后恢复
    setTimeout(() => {
      this.boostMode = false;
    }, 500);
  }

  // 公开方法：暂停/恢复动画
  toggleAnimation() {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.animate();
    } else if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// 全局实例（页面加载后初始化）
let cyberParticles;

// DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cyberParticles = new CyberParticles();
  });
} else {
  cyberParticles = new CyberParticles();
}

// 导出全局变量供外部调用
window.cyberParticles = cyberParticles;
