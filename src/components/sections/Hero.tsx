'use client'

import { motion } from 'framer-motion'
import type { ResumeBasics } from '@/lib/types'
import { Code2, Briefcase, Mail, Download, ArrowDown, Rocket, Target, Cpu } from 'lucide-react'
import { Typewriter } from '@/components/ui/Typewriter'

const STATS = [
  { icon: Rocket,  label: '3 Production AI Systems' },
  { icon: Target,  label: '0.92 F1 · 1.00 Recall'  },
  { icon: Cpu,     label: 'LangGraph · RAG · PyTorch' },
]

export function Hero({ basics }: { basics: ResumeBasics }) {
  const github   = basics.profiles.find((p) => p.network === 'GitHub')
  const linkedin = basics.profiles.find((p) => p.network === 'LinkedIn')

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 sm:px-12 py-12 shadow-2xl shadow-black/40"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Open to opportunities · MS CS @ USF · May 2026
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-4">
            {basics.name.split(' ').slice(0, 2).join(' ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400">
              {basics.name.split(' ').slice(2).join(' ')}
            </span>
          </h1>

          {/* Animated role title */}
          <p className="text-lg sm:text-xl font-semibold mb-6 h-7 flex items-center justify-center">
            <Typewriter />
          </p>

          {/* Summary */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            {basics.summary}
          </p>

          {/* Impact stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {STATS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 text-xs font-mono"
              >
                <Icon size={13} className="text-violet-400 shrink-0" />
                {label}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors shadow-lg shadow-violet-500/30 text-sm"
            >
              Get in Touch
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold transition-colors text-sm flex items-center gap-2 backdrop-blur-sm"
            >
              <Download size={15} />
              Resume PDF
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-5 mt-8">
            {github && (
              <a href={github.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors">
                <Code2 size={16} />
                {github.username}
              </a>
            )}
            {linkedin && (
              <a href={linkedin.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                <Briefcase size={16} />
                LinkedIn
              </a>
            )}
            <a href={`mailto:${basics.email}`}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors">
              <Mail size={16} />
              {basics.email}
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <a href="#projects"
          className="mt-12 inline-flex flex-col items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <span>Scroll to explore</span>
          <ArrowDown size={14} className="animate-bounce" />
        </a>
      </div>
    </section>
  )
}
