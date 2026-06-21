'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { SkipForward } from 'lucide-react'

const AUTO_DISMISS_MS = 2800

// ── Duotone scan-reveal photo ────────────────────────────────────────────
// Drop your photo at /public/avatar.jpg

function ScanPhoto() {
  return (
    <div className="relative" style={{ width: 196, height: 252 }}>
      {/* Ambient glow behind the card */}
      <motion.div
        className="absolute -inset-5 rounded-[28px] bg-gradient-to-br from-violet-600/30 to-cyan-500/30 blur-2xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Photo card — natural color, just a subtle vignette for depth */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0% 0 100% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
        >
          <Image
            src="/avatar.jpg"
            alt="Sai Phani Krishna Arumalla"
            fill
            sizes="196px"
            className="object-cover"
            priority
          />
          {/* Subtle edge vignette — adds depth without altering the photo's actual color */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 50px 14px rgba(2,8,23,0.55)' }}
          />
        </motion.div>

        {/* Scan line sweeping down, synced with the reveal */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #67e8f9, transparent)',
            boxShadow: '0 0 18px 3px rgba(103,232,249,0.85)',
          }}
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
        />

        {/* Scanner corner brackets */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-sm" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-sm" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-sm" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 rounded-br-sm" />
      </div>
    </div>
  )
}

// ── Kinetic text variants — blur-to-focus ───────────────────────────────
const kineticContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.85 } },
}
const kineticItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ── Exit transition — the same "AI scan" sweeps down once more and
// wipes the intro away, instead of a generic slide-off. Parent clips
// away top-to-bottom; the glow line riding the clip boundary is what
// sells the effect, so it must stay perfectly in sync with the parent.
const EXIT_DURATION = 1.0
const EXIT_EASE = [0.76, 0, 0.24, 1] as const

const overlayVariants: Variants = {
  visible: { clipPath: 'inset(0% 0 0 0)' },
  exit: {
    clipPath: 'inset(100% 0 0 0)',
    transition: { duration: EXIT_DURATION, ease: EXIT_EASE },
  },
}
const exitScanVariants: Variants = {
  visible: { top: '0%', opacity: 0 },
  exit: {
    top: '100%', opacity: 1,
    transition: { duration: EXIT_DURATION, ease: EXIT_EASE },
  },
}

// ── Overlay ────────────────────────────────────────────────────────────
export function IntroOverlay() {
  const [show, setShow]   = useState(false)
  const [ready, setReady] = useState(false)

  const dismiss = useCallback(() => {
    sessionStorage.setItem('portfolio_intro_seen', '1')
    setShow(false)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('portfolio_intro_seen')) return

    // Respect prefers-reduced-motion: skip the animated intro entirely rather
    // than forcing scan-lines/blur/clip-path wipes on a visitor who's opted
    // out of motion. Checked synchronously (not via a hook) so there's no
    // render where the intro briefly mounts before we know the preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('portfolio_intro_seen', '1')
      return
    }

    setShow(true)
    const readyTimer   = setTimeout(() => setReady(true), 80)
    const dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => { clearTimeout(readyTimer); clearTimeout(dismissTimer) }
  }, [dismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#020817] cursor-pointer"
          variants={overlayVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          onClick={dismiss}
          role="button"
          aria-label="Skip intro and view portfolio"
        >
          {/* Exit scan-line — sweeps down in sync with the clip-path wipe,
              "erasing" the intro to reveal the portfolio underneath */}
          <motion.div
            variants={exitScanVariants}
            className="absolute left-0 right-0 h-[3px] z-30 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #22d3ee, #a78bfa, transparent)',
              boxShadow: '0 0 36px 8px rgba(34,211,238,0.85), 0 0 70px 16px rgba(124,58,237,0.35)',
            }}
          />

          {/* Skip control */}
          <button
            onClick={dismiss}
            className="absolute top-6 right-6 z-20 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-300 tracking-wide transition-colors"
          >
            Skip <SkipForward size={12} />
          </button>

          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-700/20 blur-[120px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/15 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </div>

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScanPhoto />
            </motion.div>

            <motion.div
              className="mt-7 flex flex-col items-center"
              variants={kineticContainer}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
            >
              <motion.p variants={kineticItem} className="text-[11px] font-mono tracking-[0.28em] text-violet-400 uppercase mb-2.5">
                Hi, I&apos;m
              </motion.p>

              <motion.h1 variants={kineticItem} className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Sai Phani Krishna
              </motion.h1>

              <motion.h2
                variants={kineticItem}
                className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
                style={{
                  background: 'linear-gradient(90deg,#a78bfa 0%,#22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Arumalla
              </motion.h2>

              <motion.p variants={kineticItem} className="text-slate-400 text-sm sm:text-base">
                AI/ML Engineer · Multi-Agent Systems · RAG Pipelines
              </motion.p>
            </motion.div>
          </div>

          {/* Auto-advance progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
