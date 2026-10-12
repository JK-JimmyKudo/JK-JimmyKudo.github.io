import { useEffect, useRef, useState } from 'react'
import { profile } from '../data.js'

// 视频背景：把视频放到 public/videos/hero.mp4 即可生效；
// 没有视频时自动回退到下方画布动画（科技感粒子 + 网格 + 光晕）
export default function Hero() {
  const canvasRef = useRef(null)
  const [videoOk, setVideoOk] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // 粒子
    const N = Math.min(90, Math.floor((w * h) / 16000))
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.06),
      vx: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.5 + 0.15,
    }))

    // 光晕中心
    const blobs = [
      { x: w * 0.2, y: h * 0.35, r: Math.max(w, h) * 0.4, color: '100, 214, 255' },
      { x: w * 0.82, y: h * 0.6, r: Math.max(w, h) * 0.42, color: '155, 140, 255' },
    ]

    let t = 0
    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, w, h)

      // 光晕
      blobs.forEach((b, i) => {
        const ox = Math.sin(t * 0.6 + i * 2) * 40
        const oy = Math.cos(t * 0.5 + i * 2.4) * 30
        const g = ctx.createRadialGradient(b.x + ox, b.y + oy, 0, b.x + ox, b.y + oy, b.r)
        g.addColorStop(0, `rgba(${b.color}, 0.16)`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })

      // 网格（缓慢漂移）
      const grid = 56
      const off = (t * 14) % grid
      ctx.strokeStyle = 'rgba(255,255,255,0.035)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = -grid + off; x < w + grid; x += grid) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = -grid + off; y < h + grid; y += grid) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()

      // 粒子
      parts.forEach((p) => {
        p.y += p.vy
        p.x += p.vx
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 214, 255, ${p.a})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <canvas ref={canvasRef} className="hero-canvas" />
        {videoOk && (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/hero-poster.png"
            src="/videos/hero.mp4"
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />
      </div>

      <div className="hero-inner">
        <p className="hero-kicker">Mobile × AI × Product</p>
        <h1 className="hero-title">
          {profile.name}
          <span className="thin">.</span>
        </h1>
        <div className="hero-roles">
          {profile.roles.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#work">
            查看作品
          </a>
          <a className="btn btn-ghost" href="#contact">
            联系我
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <span>SCROLL</span>
        <span className="line" />
      </div>
    </section>
  )
}
