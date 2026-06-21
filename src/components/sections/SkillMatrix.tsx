'use client'

import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { SkillGroup } from '@/lib/types'
import type { AggregatedSkill } from '@/lib/skillDeriver'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

// Short names for radar axis labels
const RADAR_LABEL: Record<string, string> = {
  'Agentic AI & Orchestration':       'Agentic AI',
  'LLM & Generative AI':              'LLM / GenAI',
  'Machine Learning & Deep Learning': 'ML & DL',
  'RAG & Vector Databases':           'RAG',
  'Programming Languages':            'Languages',
  'Backend & APIs':                   'Backend',
  'Infrastructure & MLOps':           'MLOps',
  'Frontend':                         'Frontend',
}

function pillClass(score: number) {
  if (score >= 85) return 'bg-violet-500/15 border border-violet-500/35 text-violet-300'
  if (score >= 72) return 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-300'
  return 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
}

// ── Radar SVG ──────────────────────────────────────────────────────────────

interface RadarDatum {
  label: string
  score: number // 0–100
}

function RadarChart({ data }: { data: RadarDatum[] }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const n    = data.length
  const cx   = 210
  const cy   = 210
  const r    = 140   // axis radius
  const lr   = 178   // label radius

  const angles = data.map((_, i) => (2 * Math.PI * i) / n - Math.PI / 2)

  // Build SVG polygon path from a set of (score, angle) pairs
  function polygon(fracs: number[]) {
    return (
      fracs
        .map((frac, i) => {
          const x = (cx + r * frac * Math.cos(angles[i])).toFixed(2)
          const y = (cy + r * frac * Math.sin(angles[i])).toFixed(2)
          return `${i === 0 ? 'M' : 'L'}${x},${y}`
        })
        .join(' ') + 'Z'
    )
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]
  const dataPath   = polygon(data.map((d) => d.score / 100))
  const gridPaths  = gridLevels.map((lvl) => polygon(data.map(() => lvl)))

  const dots = data.map((d, i) => ({
    x: cx + r * (d.score / 100) * Math.cos(angles[i]),
    y: cy + r * (d.score / 100) * Math.sin(angles[i]),
  }))

  const labels = data.map((d, i) => {
    const x = cx + lr * Math.cos(angles[i])
    const y = cy + lr * Math.sin(angles[i])
    const cos = Math.cos(angles[i])
    const anchor: 'start' | 'middle' | 'end' =
      cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
    return { x, y, anchor, label: d.label, score: d.score }
  })

  return (
    <svg
      viewBox="0 0 420 420"
      overflow="visible"
      className="w-full max-w-[420px] mx-auto select-none"
    >
      <defs>
        <linearGradient id="rfill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id="rstroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="dotglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      ))}

      {/* Axis spokes */}
      {angles.map((angle, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={(cx + r * Math.cos(angle)).toFixed(2)}
          y2={(cy + r * Math.sin(angle)).toFixed(2)}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {/* Data polygon — stroke draws itself, fill fades in (instant if reduced motion) */}
      <motion.path
        d={dataPath}
        fill="url(#rfill)"
        stroke="url(#rstroke)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '0px' }}
        transition={prefersReducedMotion ? { duration: 0 } : {
          pathLength: { duration: 1.4, ease: 'easeInOut' },
          opacity:    { duration: 0.4 },
        }}
      />

      {/* Dots at each vertex */}
      {dots.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x} cy={pt.y} r={4}
          fill="#a78bfa"
          filter="url(#dotglow)"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px' }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: 0.8 + i * 0.06 }}
        />
      ))}

      {/* Axis labels */}
      {labels.map((lp, i) => (
        <text
          key={i}
          x={lp.x.toFixed(2)}
          y={lp.y.toFixed(2)}
          textAnchor={lp.anchor}
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize={10.5}
          fontFamily="ui-monospace, monospace"
        >
          {lp.label}
        </text>
      ))}

      {/* Center label */}
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.15)"
        fontSize={9}
        fontFamily="ui-monospace, monospace"
      >
        skills
      </text>
    </svg>
  )
}

// ── Main Section ───────────────────────────────────────────────────────────

interface SkillMatrixProps {
  derivedSkills: AggregatedSkill[]
  resumeSkills:  SkillGroup[]
}

export function SkillMatrix({ derivedSkills, resumeSkills }: SkillMatrixProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset: ['start end', 'start center'],
  })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 1])
  const headerY       = useTransform(scrollYProgress, [0, 1], [20, 0])

  const categories = useMemo(() =>
    resumeSkills.map((group) => {
      const skills   = derivedSkills.filter((s) => s.category === group.name).slice(0, 8)
      const avgScore = skills.length
        ? Math.round(skills.reduce((s, x) => s + x.combinedScore, 0) / skills.length)
        : group.level === 'Advanced' ? 88 : 70
      return {
        name:      group.name,
        radarLabel: RADAR_LABEL[group.name] ?? group.name,
        score:     avgScore,
        level:     group.level,
        skills,
      }
    }),
  [derivedSkills, resumeSkills])

  const radarData: RadarDatum[] = categories.map((c) => ({
    label: c.radarLabel,
    score: c.score,
  }))

  return (
    <section ref={sectionRef} id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Skill Matrix</h2>
          <p className="mt-3 text-slate-400 text-base max-w-xl">
            Radar weighted from resume proficiency (60%) and GitHub language usage (40%).
            Hover over a category card to explore individual skills.
          </p>
        </motion.div>

        {/* Radar chart */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-full max-w-[440px]">
            <RadarChart data={radarData} />
          </div>

          {/* Compact score legend below chart */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    cat.score >= 85 ? 'bg-violet-400' :
                    cat.score >= 72 ? 'bg-cyan-400'   : 'bg-slate-500'
                  }`}
                />
                <span className="text-[11px] font-mono text-slate-400">
                  {cat.radarLabel}
                </span>
                <span className="text-[11px] font-mono text-slate-600">
                  {cat.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category cards — skill pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat, i) =>
            cat.skills.length > 0 && (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-40px' }}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200 text-sm">{cat.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    {cat.level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.keyword}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-mono ${pillClass(skill.combinedScore)}`}
                    >
                      {skill.keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
