'use client'

import { useState, useMemo } from 'react'
import type { WorkItem, EducationItem, TimelineEntry } from '@/lib/types'
import { TimelineItem } from '@/components/ui/TimelineItem'
import { FilterChip } from '@/components/ui/FilterChip'

type Filter = 'All' | 'Work' | 'Education'

interface TimelineProps {
  work: WorkItem[]
  education: EducationItem[]
}

export function Timeline({ work, education }: TimelineProps) {
  const [filter, setFilter] = useState<Filter>('All')

  const entries = useMemo<TimelineEntry[]>(() => {
    const w: TimelineEntry[] = work.map((w) => ({ kind: 'work', ...w }))
    const e: TimelineEntry[] = education.map((e) => ({ kind: 'education', ...e }))

    const all = [...w, ...e].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    if (filter === 'Work')      return all.filter((x) => x.kind === 'work')
    if (filter === 'Education') return all.filter((x) => x.kind === 'education')
    return all
  }, [work, education, filter])

  return (
    <section id="resume" className="py-24 bg-surface/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Experience & Education
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {(['All', 'Work', 'Education'] as Filter[]).map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-2xl">
          {entries.map((entry, i) => (
            <TimelineItem key={`${entry.kind}-${i}`} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
