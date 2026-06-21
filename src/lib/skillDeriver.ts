import type { SkillGroup, PinnedRepo } from './types'

const LEVEL_SCORE: Record<string, number> = {
  Advanced: 100,
  Intermediate: 80,
  Beginner: 55,
}

export interface AggregatedSkill {
  keyword: string
  category: string
  resumeScore: number
  githubScore: number
  combinedScore: number
}

// Deterministic per-keyword jitter so each skill shows a distinct percentage
// without Math.random() (avoids hydration mismatches)
function seededOffset(kw: string): number {
  let h = 0
  for (let i = 0; i < kw.length; i++) h = (h * 31 + kw.charCodeAt(i)) & 0xffff
  return (h % 24) - 6  // -6 to +17, slight positive bias toward 90s
}

function clamp(v: number): number {
  return Math.min(95, Math.max(63, Math.round(v)))
}

export function deriveSkills(
  resumeSkills: SkillGroup[],
  repos: PinnedRepo[]
): AggregatedSkill[] {
  const byKeyword = new Map<string, AggregatedSkill>()

  // Seed from resume.json — Advanced → 82-95%, Intermediate → 64-87%
  for (const group of resumeSkills) {
    const baseScore = LEVEL_SCORE[group.level] ?? 50
    for (const kw of group.keywords) {
      const key = kw.toLowerCase()
      const score = clamp(baseScore * 0.88 + seededOffset(kw))
      byKeyword.set(key, {
        keyword: kw,
        category: group.name,
        resumeScore: baseScore,
        githubScore: 0,
        combinedScore: score,
      })
    }
  }

  // Augment with GitHub language data
  const langTotals = new Map<string, number>()
  for (const repo of repos) {
    for (const lang of repo.languages) {
      const key = lang.name.toLowerCase()
      langTotals.set(key, (langTotals.get(key) ?? 0) + lang.percentage)
    }
    for (const topic of repo.topics) {
      const key = topic.toLowerCase()
      langTotals.set(key, (langTotals.get(key) ?? 0) + 10)
    }
  }

  for (const [key, rawScore] of Array.from(langTotals.entries())) {
    const normalised = Math.min(rawScore, 100)
    if (byKeyword.has(key)) {
      const entry = byKeyword.get(key)!
      entry.githubScore = normalised
      // GitHub usage nudges score up slightly, but stays in 63-95 range
      entry.combinedScore = clamp(entry.combinedScore * 0.85 + normalised * 0.15)
    } else {
      byKeyword.set(key, {
        keyword: key,
        category: 'Programming Languages',
        resumeScore: 0,
        githubScore: normalised,
        combinedScore: clamp(normalised * 0.7 + seededOffset(key)),
      })
    }
  }

  return Array.from(byKeyword.values()).sort(
    (a, b) => b.combinedScore - a.combinedScore
  )
}
