'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ParticleMesh } from '@/components/ui/ParticleMesh'

export function Background() {
  const scrollProgressRef = useRef(0)
  const { scrollYProgress } = useScroll()

  // Feed scroll value into the canvas loop via ref (zero-overhead, no re-render)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgressRef.current = v
  })

  // Mesh fades slightly at the very bottom of long pages
  const meshOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.55])

  // Orbs drift at different rates — parallax depth
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%',  '25%'])
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  // Orb colors shift violet→cyan as scroll deepens
  const orb1Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.28, 0.12])
  const orb2Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.22, 0.08])

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-surface"
      style={{ willChange: 'transform' }}
    >
      {/* Particle canvas — scroll-reactive */}
      <motion.div style={{ opacity: meshOpacity }} className="absolute inset-0">
        <ParticleMesh scrollProgressRef={scrollProgressRef} />
      </motion.div>

      {/* Gradient orb 1 — violet, drifts upward */}
      <motion.div
        style={{ y: orb1Y, opacity: orb1Opacity }}
        className="absolute top-1/4 left-1/3 w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none"
        aria-hidden
        suppressHydrationWarning
      >
        <div className="w-full h-full rounded-full bg-violet-600" />
      </motion.div>

      {/* Gradient orb 2 — cyan, drifts downward */}
      <motion.div
        style={{ y: orb2Y, opacity: orb2Opacity }}
        className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] rounded-full blur-[110px] pointer-events-none"
        aria-hidden
        suppressHydrationWarning
      >
        <div className="w-full h-full rounded-full bg-cyan-500" />
      </motion.div>

      {/* Gradient orb 3 — lime, subtle */}
      <motion.div
        style={{ y: orb3Y }}
        className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-lime-500/6 blur-[90px] pointer-events-none"
        aria-hidden
        suppressHydrationWarning
      />
    </div>
  )
}
