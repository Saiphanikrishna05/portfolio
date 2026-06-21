'use client'

import { motion } from 'framer-motion'
import type { TimelineEntry } from '@/lib/types'

function formatDate(date: string) {
  if (!date) return 'Present'
  const [year, month] = date.split('-')
  const d = new Date(Number(year), Number(month) - 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const isWork = entry.kind === 'work'
  const title  = isWork ? entry.position  : entry.studyType
  const org    = isWork ? entry.name      : entry.institution
  const desc   = isWork
    ? entry.highlights
    : entry.courses.slice(0, 4).map((c) => `• ${c}`)
  const tags = isWork ? entry.keywords : []

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      className="relative pl-8 pb-10 group"
    >
      {/* Vertical line */}
      <span className="absolute left-0 top-2 bottom-0 w-px bg-white/10 group-last:hidden" />

      {/* Dot */}
      <span
        className={`absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-violet-500 ${
          isWork ? 'bg-violet-500 shadow-[0_0_8px_2px_rgba(139,92,246,0.4)]' : 'bg-surface'
        }`}
      />

      <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-slate-100 text-base">{title}</h3>
            <p className="text-violet-400 font-medium text-sm">{org}</p>
          </div>
          <span className="text-xs text-slate-500 font-mono shrink-0 mt-0.5">
            {formatDate(entry.startDate)}–{formatDate(entry.endDate)}
          </span>
        </div>

        {/* Highlights / courses */}
        {desc.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {desc.map((item, i) => (
              <li key={i} className="text-sm text-slate-400 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
