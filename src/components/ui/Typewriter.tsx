'use client'

import { useState, useEffect } from 'react'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

const ROLES = [
  'AI/ML Engineer',
  'Multi-Agent Architect',
  'RAG Pipeline Engineer',
  'Full Stack Developer',
  'LLM Systems Builder',
  'Software Engineer',
  'Production AI Developer',
]

export function Typewriter() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [roleIdx, setRoleIdx] = useState(0)
  const [text, setText] = useState(ROLES[0])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return
    const word = ROLES[roleIdx]

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), 1800)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % ROLES.length)
      return
    }

    const speed = deleting ? 42 : 72
    const t = setTimeout(() => {
      setText(deleting
        ? word.slice(0, text.length - 1)
        : word.slice(0, text.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [mounted, text, deleting, roleIdx, prefersReducedMotion])

  // Static role, no cycling or blinking cursor, for reduced-motion visitors
  if (prefersReducedMotion) {
    return <span className="text-cyan-400 font-mono">{ROLES[0]}</span>
  }

  return (
    <span className="text-cyan-400 font-mono">
      {text}
      <span
        className="ml-0.5 inline-block w-0.5 h-[1.1em] align-middle bg-cyan-400 animate-pulse"
        aria-hidden
      />
    </span>
  )
}
