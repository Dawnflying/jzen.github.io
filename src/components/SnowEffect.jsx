import React, { useEffect, useRef } from 'react'
import './SnowEffect.css'

const SnowEffect = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes = []
    const numberOfSnowflakes = 35 // 减少雪花数量，营造寂静感

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 4 + 2 // 更大的雪花
        this.speed = Math.random() * 0.8 + 0.3 // 更慢的飘落速度
        this.wind = Math.random() * 0.3 - 0.15 // 更轻柔的风
        this.opacity = Math.random() * 0.6 + 0.3 // 更明显的雪花
        this.sway = Math.random() * Math.PI * 2 // 摆动相位
        this.swaySpeed = Math.random() * 0.01 + 0.005 // 摆动速度
      }

      update() {
        // 缓慢飘落
        this.y += this.speed
        
        // 左右摆动，模拟雪花飘舞
        this.sway += this.swaySpeed
        this.x += Math.sin(this.sway) * 0.5 + this.wind

        if (this.y > canvas.height) {
          this.y = -10
          this.x = Math.random() * canvas.width
        }

        if (this.x > canvas.width) {
          this.x = 0
        } else if (this.x < 0) {
          this.x = canvas.width
        }
      }

      draw() {
        // 检测当前主题
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // 根据主题调整雪花颜色
        const snowColor = isDark ? '200, 220, 235' : '230, 240, 248'
        ctx.fillStyle = `rgba(${snowColor}, ${this.opacity})`
        ctx.fill()
        ctx.closePath()
        
        // 添加雪花的光晕效果
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2)
        const glowColor = isDark ? '123, 163, 192' : '168, 200, 216'
        ctx.fillStyle = `rgba(${glowColor}, ${this.opacity * 0.2})`
        ctx.fill()
        ctx.closePath()
      }
    }

    // 创建雪花
    for (let i = 0; i < numberOfSnowflakes; i++) {
      snowflakes.push(new Snowflake())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      snowflakes.forEach(snowflake => {
        snowflake.update()
        snowflake.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="snow-canvas" />
}

export default SnowEffect

