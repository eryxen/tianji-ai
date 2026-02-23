/**
 * 天机AI - 赛博地图选择器
 * 基于 Canvas 绘制的简约世界地图 + 城市搜索
 */

class CyberMap {
  constructor() {
    this.mapCanvas = document.getElementById('mapCanvas');
    this.mapContainer = document.getElementById('mapContainer');
    this.mapToggle = document.getElementById('mapToggle');
    this.mapConfirm = document.getElementById('mapConfirm');
    this.mapClose = document.getElementById('mapClose');
    this.mapCoords = document.getElementById('mapCoords');
    this.birthplaceInput = document.getElementById('birthplace');
    this.suggestionsEl = document.getElementById('birthplaceSuggestions');
    
    this.canvas = null;
    this.ctx = null;
    this.selectedLat = null;
    this.selectedLng = null;
    this.selectedCity = null;
    this.marker = null;
    
    // 主要城市数据库（经纬度）
    this.cities = [
      // 中国
      { name: '北京', lat: 39.9, lng: 116.4, country: '中国' },
      { name: '上海', lat: 31.2, lng: 121.5, country: '中国' },
      { name: '广州', lat: 23.1, lng: 113.3, country: '中国' },
      { name: '深圳', lat: 22.5, lng: 114.1, country: '中国' },
      { name: '成都', lat: 30.6, lng: 104.1, country: '中国' },
      { name: '重庆', lat: 29.6, lng: 106.5, country: '中国' },
      { name: '杭州', lat: 30.3, lng: 120.2, country: '中国' },
      { name: '武汉', lat: 30.6, lng: 114.3, country: '中国' },
      { name: '南京', lat: 32.1, lng: 118.8, country: '中国' },
      { name: '西安', lat: 34.3, lng: 108.9, country: '中国' },
      { name: '长沙', lat: 28.2, lng: 112.9, country: '中国' },
      { name: '天津', lat: 39.1, lng: 117.2, country: '中国' },
      { name: '苏州', lat: 31.3, lng: 120.6, country: '中国' },
      { name: '郑州', lat: 34.7, lng: 113.7, country: '中国' },
      { name: '沈阳', lat: 41.8, lng: 123.4, country: '中国' },
      { name: '哈尔滨', lat: 45.8, lng: 126.7, country: '中国' },
      { name: '大连', lat: 38.9, lng: 121.6, country: '中国' },
      { name: '福州', lat: 26.1, lng: 119.3, country: '中国' },
      { name: '厦门', lat: 24.5, lng: 118.1, country: '中国' },
      { name: '昆明', lat: 25.0, lng: 102.7, country: '中国' },
      { name: '贵阳', lat: 26.6, lng: 106.7, country: '中国' },
      { name: '济南', lat: 36.7, lng: 117.0, country: '中国' },
      { name: '青岛', lat: 36.1, lng: 120.4, country: '中国' },
      { name: '合肥', lat: 31.8, lng: 117.3, country: '中国' },
      { name: '南昌', lat: 28.7, lng: 115.9, country: '中国' },
      { name: '兰州', lat: 36.1, lng: 103.8, country: '中国' },
      { name: '乌鲁木齐', lat: 43.8, lng: 87.6, country: '中国' },
      { name: '拉萨', lat: 29.7, lng: 91.1, country: '中国' },
      { name: '呼和浩特', lat: 40.8, lng: 111.7, country: '中国' },
      { name: '南宁', lat: 22.8, lng: 108.4, country: '中国' },
      { name: '海口', lat: 20.0, lng: 110.4, country: '中国' },
      // 港澳台
      { name: '香港', lat: 22.3, lng: 114.2, country: '中国' },
      { name: '澳门', lat: 22.2, lng: 113.5, country: '中国' },
      { name: '台北', lat: 25.0, lng: 121.5, country: '中国' },
      { name: '高雄', lat: 22.6, lng: 120.3, country: '中国' },
      // 东南亚
      { name: '吉隆坡', lat: 3.1, lng: 101.7, country: '马来西亚' },
      { name: 'Kuala Lumpur', lat: 3.1, lng: 101.7, country: 'Malaysia' },
      { name: '槟城', lat: 5.4, lng: 100.3, country: '马来西亚' },
      { name: '新山', lat: 1.5, lng: 103.7, country: '马来西亚' },
      { name: '新加坡', lat: 1.4, lng: 103.8, country: '新加坡' },
      { name: '曼谷', lat: 13.8, lng: 100.5, country: '泰国' },
      { name: '雅加达', lat: -6.2, lng: 106.8, country: '印尼' },
      { name: '马尼拉', lat: 14.6, lng: 121.0, country: '菲律宾' },
      { name: '胡志明市', lat: 10.8, lng: 106.7, country: '越南' },
      { name: '河内', lat: 21.0, lng: 105.8, country: '越南' },
      // 东亚
      { name: '东京', lat: 35.7, lng: 139.7, country: '日本' },
      { name: '大阪', lat: 34.7, lng: 135.5, country: '日本' },
      { name: '首尔', lat: 37.6, lng: 127.0, country: '韩国' },
      // 其他
      { name: '纽约', lat: 40.7, lng: -74.0, country: '美国' },
      { name: '洛杉矶', lat: 34.1, lng: -118.2, country: '美国' },
      { name: '旧金山', lat: 37.8, lng: -122.4, country: '美国' },
      { name: '伦敦', lat: 51.5, lng: -0.1, country: '英国' },
      { name: '巴黎', lat: 48.9, lng: 2.3, country: '法国' },
      { name: '悉尼', lat: -33.9, lng: 151.2, country: '澳大利亚' },
      { name: '墨尔本', lat: -37.8, lng: 145.0, country: '澳大利亚' },
      { name: '温哥华', lat: 49.3, lng: -123.1, country: '加拿大' },
      { name: '多伦多', lat: 43.7, lng: -79.4, country: '加拿大' },
      { name: '迪拜', lat: 25.2, lng: 55.3, country: '阿联酋' },
      { name: '莫斯科', lat: 55.8, lng: 37.6, country: '俄罗斯' },
      { name: '柏林', lat: 52.5, lng: 13.4, country: '德国' },
    ];

    this.init();
  }

  init() {
    // 地图开关
    this.mapToggle.addEventListener('click', () => this.toggleMap());
    this.mapClose.addEventListener('click', () => this.closeMap());
    this.mapConfirm.addEventListener('click', () => this.confirmSelection());
    
    // 输入搜索
    this.birthplaceInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.birthplaceInput.addEventListener('focus', (e) => {
      if (e.target.value.length > 0) this.handleSearch(e.target.value);
    });
    
    // 点击外部关闭建议
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.birthplace-wrapper') && !e.target.closest('.suggestions-dropdown')) {
        this.suggestionsEl.style.display = 'none';
      }
    });
  }

  toggleMap() {
    if (this.mapContainer.style.display === 'none') {
      this.mapContainer.style.display = 'block';
      this.initCanvas();
      this.drawMap();
    } else {
      this.closeMap();
    }
  }

  closeMap() {
    this.mapContainer.style.display = 'none';
  }

  initCanvas() {
    if (this.canvas) return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.mapCanvas.appendChild(this.canvas);
    
    const rect = this.mapCanvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.ctx = this.canvas.getContext('2d');
    
    // 点击选点
    this.canvas.addEventListener('click', (e) => this.handleMapClick(e));
    
    // 窗口大小变化
    window.addEventListener('resize', () => {
      if (this.mapContainer.style.display !== 'none') {
        const rect = this.mapCanvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.drawMap();
      }
    });
  }

  // 经纬度转画布坐标（墨卡托简化）
  lngLatToXY(lng, lat) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const x = ((lng + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return { x, y };
  }

  // 画布坐标转经纬度
  xyToLngLat(x, y) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const lng = (x / w) * 360 - 180;
    const lat = 90 - (y / h) * 180;
    return { lng, lat };
  }

  drawMap() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 背景
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, w, h);
    
    // 网格线
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.08)';
    ctx.lineWidth = 0.5;
    
    // 经线
    for (let lng = -180; lng <= 180; lng += 30) {
      const { x } = this.lngLatToXY(lng, 0);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // 纬线
    for (let lat = -90; lat <= 90; lat += 30) {
      const { y } = this.lngLatToXY(0, lat);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    // 赤道
    ctx.strokeStyle = 'rgba(157, 78, 221, 0.15)';
    ctx.lineWidth = 1;
    const eq = this.lngLatToXY(0, 0);
    ctx.beginPath();
    ctx.moveTo(0, eq.y);
    ctx.lineTo(w, eq.y);
    ctx.stroke();
    
    // 绘制城市点
    this.cities.forEach(city => {
      const { x, y } = this.lngLatToXY(city.lng, city.lat);
      
      // 小光点
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(74, 158, 255, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#4A9EFF';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    // 简化大陆轮廓（用关键点连线暗示）
    this.drawContinentOutlines(ctx);
    
    // 绘制已选中的标记
    if (this.selectedLat !== null) {
      this.drawSelectedMarker();
    }
  }

  drawContinentOutlines(ctx) {
    ctx.strokeStyle = 'rgba(192, 192, 192, 0.12)';
    ctx.lineWidth = 1;
    
    // 简化的大陆轮廓点（亚洲为主）
    const continents = [
      // 东亚轮廓
      [[120,53],[135,46],[141,43],[140,35],[132,34],[130,33],[127,37],[125,38],[122,40],[121,31],[120,22],[110,20],[108,22],[106,10],[103,2],[100,7],[98,16],[97,28],[88,27],[80,30],[75,35],[68,24],[60,25],[50,27],[40,37],[30,31],[32,30],[35,12],[42,12],[45,2],[50,-2]],
      // 欧洲简化
      [[0,51],[5,52],[10,54],[15,55],[20,55],[25,60],[30,60],[40,56],[30,45],[25,38],[10,37],[0,44],[-5,48],[-10,52]],
      // 北美简化
      [[-60,50],[-65,45],[-75,40],[-80,25],[-90,20],[-100,20],[-105,25],[-117,33],[-122,37],[-125,48],[-130,55],[-140,60],[-165,65],[-170,55]],
      // 南美简化
      [[-80,10],[-75,5],[-70,-5],[-60,-5],[-50,0],[-35,-5],[-40,-15],[-45,-23],[-50,-30],[-58,-35],[-65,-40],[-70,-50],[-75,-45],[-75,-30],[-80,-5],[-80,10]],
      // 非洲简化
      [[-15,35],[10,37],[15,32],[25,32],[35,30],[42,12],[50,-2],[45,-12],[40,-20],[35,-34],[28,-34],[15,-28],[12,-17],[10,-5],[5,5],[-5,5],[-10,10],[-17,15],[-17,22],[-15,35]],
      // 澳大利亚
      [[115,-35],[120,-34],[130,-32],[136,-35],[140,-38],[148,-38],[151,-34],[153,-28],[145,-20],[142,-12],[136,-12],[130,-15],[122,-18],[114,-22],[113,-25],[115,-35]],
    ];
    
    continents.forEach(points => {
      if (points.length < 2) return;
      ctx.beginPath();
      const start = this.lngLatToXY(points[0][0], points[0][1]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < points.length; i++) {
        const p = this.lngLatToXY(points[i][0], points[i][1]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    });
  }

  drawSelectedMarker() {
    if (this.selectedLat === null) return;
    const { x, y } = this.lngLatToXY(this.selectedLng, this.selectedLat);
    const ctx = this.ctx;
    
    // 外圈脉冲
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 内圈
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00FF41';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00FF41';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 十字线
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
  }

  handleMapClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const { lng, lat } = this.xyToLngLat(x, y);
    
    // 找最近的城市
    const nearest = this.findNearestCity(lat, lng);
    
    if (nearest && nearest.distance < 8) {
      this.selectedLat = nearest.city.lat;
      this.selectedLng = nearest.city.lng;
      this.selectedCity = nearest.city;
      this.mapCoords.textContent = `${nearest.city.name}（${nearest.city.country}）`;
    } else {
      this.selectedLat = lat;
      this.selectedLng = lng;
      this.selectedCity = null;
      this.mapCoords.textContent = `${lat.toFixed(1)}°${lat > 0 ? 'N' : 'S'}, ${lng.toFixed(1)}°${lng > 0 ? 'E' : 'W'}`;
    }
    
    this.mapConfirm.style.display = 'inline-block';
    this.drawMap();
  }

  findNearestCity(lat, lng) {
    let nearest = null;
    let minDist = Infinity;
    
    this.cities.forEach(city => {
      const dlat = city.lat - lat;
      const dlng = city.lng - lng;
      const dist = Math.sqrt(dlat * dlat + dlng * dlng);
      if (dist < minDist) {
        minDist = dist;
        nearest = { city, distance: dist };
      }
    });
    
    return nearest;
  }

  confirmSelection() {
    if (this.selectedCity) {
      this.birthplaceInput.value = this.selectedCity.name;
    } else if (this.selectedLat !== null) {
      this.birthplaceInput.value = `${this.selectedLat.toFixed(1)}°, ${this.selectedLng.toFixed(1)}°`;
    }
    this.closeMap();
  }

  handleSearch(query) {
    if (!query || query.length < 1) {
      this.suggestionsEl.style.display = 'none';
      return;
    }
    
    const q = query.toLowerCase();
    const matches = this.cities.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.country.toLowerCase().includes(q)
    ).slice(0, 8);
    
    if (matches.length === 0) {
      this.suggestionsEl.style.display = 'none';
      return;
    }
    
    this.suggestionsEl.innerHTML = matches.map(c => 
      `<div class="suggestion-item" data-name="${c.name}" data-lat="${c.lat}" data-lng="${c.lng}">
        ${c.name}（${c.country}）
      </div>`
    ).join('');
    
    this.suggestionsEl.style.display = 'block';
    
    // 点击建议项
    this.suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        this.birthplaceInput.value = item.dataset.name;
        this.suggestionsEl.style.display = 'none';
        
        // 如果地图打开，更新标记
        if (this.mapContainer.style.display !== 'none') {
          this.selectedLat = parseFloat(item.dataset.lat);
          this.selectedLng = parseFloat(item.dataset.lng);
          this.selectedCity = this.cities.find(c => c.name === item.dataset.name);
          this.mapCoords.textContent = `${item.dataset.name}`;
          this.mapConfirm.style.display = 'inline-block';
          this.drawMap();
        }
      });
    });
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CyberMap());
} else {
  new CyberMap();
}
