'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseVx: number
  baseVy: number
}

interface Props {
  scrollProgressRef: React.MutableRefObject<number>
}

export function ParticleMesh({ scrollProgressRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    if (!ctx) return

    const COUNT        = 90
    const BASE_CONNECT = 140
    const REPEL_DIST   = 110
    const REPEL_FORCE  = 0.6
    const MAX_SPEED    = 2.5

    let particles: Particle[] = []
    let rafId: number
    let W = 0
    let H = 0

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function spawn(): Particle {
      const vx = (Math.random() - 0.5) * 0.5
      const vy = (Math.random() - 0.5) * 0.5
      return { x: Math.random() * W, y: Math.random() * H, vx, vy, baseVx: vx, baseVy: vy, radius: Math.random() * 1.5 + 0.5 }
    }

    function init() { resize(); particles = Array.from({ length: COUNT }, spawn) }

    function lerpColor(s: number) {
      // Violet (139,92,246) → Cyan (34,211,238) as scroll 0→1
      const r = Math.round(139 + s * (34  - 139))
      const g = Math.round(92  + s * (211 - 92))
      const b = Math.round(246 + s * (238 - 246))
      return `${r},${g},${b}`
    }

    function frame() {
      ctx.clearRect(0, 0, W, H)

      const scroll  = scrollProgressRef.current            // 0 → 1
      const speed   = 0.4 + scroll * 1.8                   // speeds up with scroll
      const connect = BASE_CONNECT * (1 - scroll * 0.45)   // connections tighten
      const rgb     = lerpColor(scroll)

      const { x: mx, y: my } = mouseRef.current

      for (const p of particles) {
        const dx   = p.x - mx
        const dy   = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_DIST && dist > 0) {
          const force = (REPEL_DIST - dist) / REPEL_DIST
          p.vx += (dx / dist) * force * REPEL_FORCE
          p.vy += (dy / dist) * force * REPEL_FORCE
        }

        // Drift back toward base, faster when scrolled deep
        const drift = 0.015 + scroll * 0.025
        p.vx += (p.baseVx - p.vx) * drift
        p.vy += (p.baseVy - p.vy) * drift

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED }

        p.x += p.vx * speed
        p.y += p.vy * speed

        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        // Glow node — color shifts with scroll
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + scroll * 0.5, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(${rgb}, 0.85)`
        ctx.shadowColor = `rgb(${rgb})`
        ctx.shadowBlur  = 8 + scroll * 6
        ctx.fill()
      }

      ctx.shadowBlur = 0

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]; const b = particles[j]
          const ddx = a.x - b.x;  const ddy = a.y - b.y
          const d   = Math.sqrt(ddx * ddx + ddy * ddy)
          if (d < connect) {
            const alpha = (1 - d / connect) * (0.25 + scroll * 0.2)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
            ctx.lineWidth   = 0.6
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    init(); frame()

    const onMove  = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onLeave  = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const onResize = () => init()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [scrollProgressRef])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
