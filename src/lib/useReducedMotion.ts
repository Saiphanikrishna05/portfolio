'use client'

import { useState, useEffect } from 'react'

/**
 * Tracks the user's `prefers-reduced-motion` OS setting.
 * Defaults to `false` (motion enabled) until resolved client-side, then
 * stays in sync if the user changes the setting while the page is open.
 */
export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefers(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefers
}
