import React, { useRef, useEffect, useState } from 'react'
import Header from '../components/Header'
import './StarChart.css'

// 二十八星宿数据 - 基于天球坐标系统
// 坐标系统：赤经(RA) 0-360度，赤纬(Dec) -90到+90度
const TWENTY_EIGHT_STARS = [
  // 东方苍龙七宿
  { name: '角', pinyin: 'Jiao', group: '东方苍龙', ra: 190, dec: 30, magnitude: 3.5 },
  { name: '亢', pinyin: 'Kang', group: '东方苍龙', ra: 200, dec: 25, magnitude: 3.8 },
  { name: '氐', pinyin: 'Di', group: '东方苍龙', ra: 210, dec: 20, magnitude: 3.9 },
  { name: '房', pinyin: 'Fang', group: '东方苍龙', ra: 220, dec: 15, magnitude: 4.0 },
  { name: '心', pinyin: 'Xin', group: '东方苍龙', ra: 230, dec: 10, magnitude: 3.6 },
  { name: '尾', pinyin: 'Wei', group: '东方苍龙', ra: 240, dec: 5, magnitude: 3.8 },
  { name: '箕', pinyin: 'Ji', group: '东方苍龙', ra: 250, dec: 0, magnitude: 3.7 },
  
  // 北方玄武七宿
  { name: '斗', pinyin: 'Dou', group: '北方玄武', ra: 260, dec: -10, magnitude: 3.5 },
  { name: '牛', pinyin: 'Niu', group: '北方玄武', ra: 270, dec: -15, magnitude: 3.8 },
  { name: '女', pinyin: 'Nv', group: '北方玄武', ra: 280, dec: -20, magnitude: 3.9 },
  { name: '虚', pinyin: 'Xu', group: '北方玄武', ra: 290, dec: -25, magnitude: 3.7 },
  { name: '危', pinyin: 'Wei', group: '北方玄武', ra: 300, dec: -30, magnitude: 3.8 },
  { name: '室', pinyin: 'Shi', group: '北方玄武', ra: 310, dec: -25, magnitude: 3.6 },
  { name: '壁', pinyin: 'Bi', group: '北方玄武', ra: 320, dec: -20, magnitude: 3.7 },
  
  // 西方白虎七宿
  { name: '奎', pinyin: 'Kui', group: '西方白虎', ra: 330, dec: -15, magnitude: 3.5 },
  { name: '娄', pinyin: 'Lou', group: '西方白虎', ra: 340, dec: -10, magnitude: 3.8 },
  { name: '胃', pinyin: 'Wei', group: '西方白虎', ra: 350, dec: -5, magnitude: 3.9 },
  { name: '昴', pinyin: 'Mao', group: '西方白虎', ra: 0, dec: 0, magnitude: 3.6 },
  { name: '毕', pinyin: 'Bi', group: '西方白虎', ra: 10, dec: 5, magnitude: 3.8 },
  { name: '觜', pinyin: 'Zi', group: '西方白虎', ra: 20, dec: 10, magnitude: 3.7 },
  { name: '参', pinyin: 'Shen', group: '西方白虎', ra: 30, dec: 15, magnitude: 3.5 },
  
  // 南方朱雀七宿
  { name: '井', pinyin: 'Jing', group: '南方朱雀', ra: 40, dec: 20, magnitude: 3.6 },
  { name: '鬼', pinyin: 'Gui', group: '南方朱雀', ra: 50, dec: 25, magnitude: 3.8 },
  { name: '柳', pinyin: 'Liu', group: '南方朱雀', ra: 60, dec: 30, magnitude: 3.7 },
  { name: '星', pinyin: 'Xing', group: '南方朱雀', ra: 70, dec: 25, magnitude: 3.9 },
  { name: '张', pinyin: 'Zhang', group: '南方朱雀', ra: 80, dec: 20, magnitude: 3.6 },
  { name: '翼', pinyin: 'Yi', group: '南方朱雀', ra: 90, dec: 15, magnitude: 3.8 },
  { name: '轸', pinyin: 'Zhen', group: '南方朱雀', ra: 100, dec: 10, magnitude: 3.7 },
]

// 银河路径数据点（基于银道坐标）
const MILKY_WAY_POINTS = [
  // 银河中心区域（人马座方向）
  { ra: 265, dec: -29 },
  { ra: 270, dec: -25 },
  { ra: 275, dec: -20 },
  { ra: 280, dec: -15 },
  // 天鹅座方向
  { ra: 300, dec: 38 },
  { ra: 310, dec: 42 },
  { ra: 320, dec: 45 },
  // 仙后座-仙王座方向
  { ra: 340, dec: 50 },
  { ra: 350, dec: 55 },
  { ra: 0, dec: 58 },
  { ra: 10, dec: 60 },
  // 双子座-御夫座方向
  { ra: 80, dec: 35 },
  { ra: 90, dec: 30 },
  { ra: 100, dec: 25 },
  // 船底座方向
  { ra: 140, dec: -60 },
  { ra: 150, dec: -58 },
  { ra: 160, dec: -55 },
  // 返回中心
  { ra: 200, dec: -40 },
  { ra: 230, dec: -35 },
  { ra: 250, dec: -32 },
]

// 四季对应的视角偏移角度（模拟地球公转）
const SEASON_OFFSETS = {
  '春分': 0,    // 春分：0度偏移
  '夏至': 90,   // 夏至：90度偏移（3个月）
  '秋分': 180,  // 秋分：180度偏移（6个月）
  '冬至': 270   // 冬至：270度偏移（9个月）
}

const StarChart = () => {
  const canvasRef = useRef(null)
  const [season, setSeason] = useState('春分')
  const [zoom, setZoom] = useState(1)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    
    updateCanvasSize()

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.4 * zoom

      // 清空画布
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, width, height)

      // 绘制背景星空（固定随机点）
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      // 使用固定的随机种子，确保星星位置一致
      const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000
        return x - Math.floor(x)
      }
      for (let i = 0; i < 500; i++) {
        const seed1 = i * 0.01
        const seed2 = i * 0.01 + 1000
        const seed3 = i * 0.01 + 2000
        const x = seededRandom(seed1) * width
        const y = seededRandom(seed2) * height
        const size = seededRandom(seed3) * 0.5
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 获取季节偏移
      const offset = SEASON_OFFSETS[season]

      // 绘制银河
      drawMilkyWay(ctx, width, height, centerX, centerY, radius, offset)

      // 绘制二十八星宿连线
      drawConstellationLines(ctx, centerX, centerY, radius, offset)

      // 绘制二十八星宿星星
      drawStars(ctx, centerX, centerY, radius, offset)

      // 绘制标签
      if (showLabels) {
        drawLabels(ctx, centerX, centerY, radius, offset, width, height)
      }

      // 绘制坐标网格（可选）
      drawGrid(ctx, width, height, centerX, centerY, radius, offset)
    }

    // 绘制银河
    const drawMilkyWay = (ctx, width, height, centerX, centerY, radius, offset) => {
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2)
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.15)')
      gradient.addColorStop(0.3, 'rgba(80, 120, 200, 0.2)')
      gradient.addColorStop(0.6, 'rgba(60, 90, 150, 0.15)')
      gradient.addColorStop(1, 'rgba(40, 60, 100, 0.1)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // 绘制银河带
      ctx.strokeStyle = 'rgba(120, 180, 255, 0.3)'
      ctx.lineWidth = 3
      ctx.beginPath()

      MILKY_WAY_POINTS.forEach((point, index) => {
        const { x, y } = raDecToXY(point.ra, point.dec, centerX, centerY, radius, offset)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // 添加银河光晕效果
      ctx.save()
      ctx.globalAlpha = 0.1
      const milkyWayGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius)
      milkyWayGradient.addColorStop(0, 'rgba(150, 200, 255, 0)')
      milkyWayGradient.addColorStop(0.5, 'rgba(150, 200, 255, 0.3)')
      milkyWayGradient.addColorStop(1, 'rgba(150, 200, 255, 0)')
      
      ctx.fillStyle = milkyWayGradient
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }

    // 绘制星座连线
    const drawConstellationLines = (ctx, centerX, centerY, radius, offset) => {
      ctx.strokeStyle = 'rgba(200, 220, 255, 0.4)'
      ctx.lineWidth = 1

      // 按组绘制连线
      const groups = ['东方苍龙', '北方玄武', '西方白虎', '南方朱雀']
      
      groups.forEach(group => {
        const groupStars = TWENTY_EIGHT_STARS.filter(star => star.group === group)
        
        ctx.beginPath()
        groupStars.forEach((star, index) => {
          const { x, y } = raDecToXY(star.ra, star.dec, centerX, centerY, radius, offset)
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()
      })
    }

    // 绘制星星
    const drawStars = (ctx, centerX, centerY, radius, offset) => {
      TWENTY_EIGHT_STARS.forEach(star => {
        const { x, y } = raDecToXY(star.ra, star.dec, centerX, centerY, radius, offset)
        
        // 根据星等绘制不同大小的星星
        const starSize = (5 - star.magnitude) * 1.5
        const brightness = (5 - star.magnitude) / 5

        // 绘制光晕
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, starSize * 3)
        gradient.addColorStop(0, `rgba(255, 255, 200, ${brightness * 0.8})`)
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.4})`)
        gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, starSize * 3, 0, Math.PI * 2)
        ctx.fill()

        // 绘制星点
        ctx.fillStyle = `rgba(255, 255, 220, ${brightness})`
        ctx.beginPath()
        ctx.arc(x, y, starSize, 0, Math.PI * 2)
        ctx.fill()

        // 绘制星芒效果
        ctx.strokeStyle = `rgba(255, 255, 220, ${brightness * 0.6})`
        ctx.lineWidth = 1
        ctx.save()
        ctx.translate(x, y)
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 4)
          ctx.beginPath()
          ctx.moveTo(0, -starSize * 2)
          ctx.lineTo(0, -starSize * 4)
          ctx.moveTo(0, starSize * 2)
          ctx.lineTo(0, starSize * 4)
          ctx.stroke()
        }
        ctx.restore()
      })
    }

    // 绘制标签
    const drawLabels = (ctx, centerX, centerY, radius, offset, width, height) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = '14px STLiTi, LiSu, STKaiti, KaiTi, SimLi, FangSong, "Microsoft YaHei", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      TWENTY_EIGHT_STARS.forEach(star => {
        const { x, y } = raDecToXY(star.ra, star.dec, centerX, centerY, radius, offset)
        
        // 检查是否在画布内
        if (x > 0 && x < width && y > 0 && y < height) {
          ctx.fillText(star.name, x, y - 25)
          ctx.font = '10px STLiTi, LiSu, STKaiti, KaiTi, SimLi, FangSong, "Microsoft YaHei", serif'
          ctx.fillStyle = 'rgba(200, 220, 255, 0.7)'
          ctx.fillText(star.pinyin, x, y - 12)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.font = '14px STLiTi, LiSu, STKaiti, KaiTi, SimLi, FangSong, "Microsoft YaHei", serif'
        }
      })
    }

    // 绘制网格
    const drawGrid = (ctx, width, height, centerX, centerY, radius, offset) => {
      ctx.strokeStyle = 'rgba(100, 150, 200, 0.1)'
      ctx.lineWidth = 0.5

      // 绘制赤纬圈
      for (let dec = -90; dec <= 90; dec += 30) {
        ctx.beginPath()
        const decRadius = radius * Math.cos((dec * Math.PI) / 180)
        if (decRadius > 0) {
          ctx.arc(centerX, centerY, decRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // 绘制赤经线
      for (let ra = 0; ra < 360; ra += 30) {
        const adjustedRA = (ra - offset + 360) % 360
        const angle = (adjustedRA * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        )
        ctx.stroke()
      }
    }

    // 将赤经赤纬转换为屏幕坐标
    const raDecToXY = (ra, dec, centerX, centerY, radius, offset) => {
      // 应用季节偏移
      const adjustedRA = (ra - offset + 360) % 360
      
      // 转换为弧度
      const raRad = (adjustedRA * Math.PI) / 180
      const decRad = (dec * Math.PI) / 180
      
      // 等距方位投影
      const r = radius * (1 - (dec / 90))
      const x = centerX + Math.cos(raRad) * r
      const y = centerY + Math.sin(raRad) * r
      
      return { x, y }
    }

    draw()

    const handleResize = () => {
      updateCanvasSize()
      draw()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [season, zoom, showLabels])

  return (
    <div className="star-chart-page">
      <Header />
      <div className="star-chart-container">
        <div className="star-chart-header">
          <h1 className="star-chart-title">二十八星宿星图</h1>
          <p className="star-chart-subtitle">探索中国古代天文学的璀璨星空</p>
        </div>

        <div className="star-chart-controls">
          <div className="control-group">
            <label>季节：</label>
            <div className="season-buttons">
              {Object.keys(SEASON_OFFSETS).map(s => (
                <button
                  key={s}
                  className={`season-btn ${season === s ? 'active' : ''}`}
                  onClick={() => setSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>缩放：</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-slider"
            />
            <span className="zoom-value">{zoom.toFixed(1)}x</span>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
              显示标签
            </label>
          </div>
        </div>

        <div className="star-chart-canvas-wrapper">
          <canvas ref={canvasRef} className="star-chart-canvas" />
        </div>

        <div className="star-chart-info">
          <div className="info-section">
            <h3>当前季节：{season}</h3>
            <p>视角偏移：{SEASON_OFFSETS[season]}°</p>
          </div>
          <div className="info-section">
            <h3>四象分组</h3>
            <div className="constellation-groups">
              <span className="group-badge group-east">东方苍龙</span>
              <span className="group-badge group-north">北方玄武</span>
              <span className="group-badge group-west">西方白虎</span>
              <span className="group-badge group-south">南方朱雀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarChart

