'use client'

import { useEffect, useRef, useState } from 'react'
import type { AggregatedSkill } from '@/lib/skillDeriver'

export function SkillBadge({ skill }: { skill: AggregatedSkill }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const pct = Math.round(skill.combinedScore)

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-slate-400 text-xs">{skill.keyword}</span>
        <span className="text-xs text-slate-500 font-mono">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}
