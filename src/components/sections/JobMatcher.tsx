'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, ChevronRight } from 'lucide-react'

// ── Simple streaming text renderer ─────────────────────────────────────────

function renderOutput(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const trimmed = line.trim()

    // Section headers: **Match Score: ...** or **Why Sai Fits** etc.
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const content = trimmed.slice(2, -2)
      // Match score gets special treatment
      if (content.startsWith('Match Score:')) {
        const score = content.match(/(\d+)\/100/)
        const num = score ? parseInt(score[1], 10) : null
        return (
          <div key={i} className="flex items-center gap-3 mb-4">
            <span className="text-base font-bold text-white">{content}</span>
            {num !== null && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-md border ${
                  num >= 80
                    ? 'bg-green-500/15 border-green-500/30 text-green-400'
                    : num >= 60
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-red-500/15 border-red-500/30 text-red-400'
                }`}
              >
                {num >= 80 ? 'Strong Match' : num >= 60 ? 'Good Match' : 'Partial Match'}
              </span>
            )}
          </div>
        )
      }
      return (
        <p key={i} className="font-semibold text-violet-300 mt-5 mb-2 first:mt-0">
          {content}
        </p>
      )
    }

    // Bullet points
    if (trimmed.startsWith('•')) {
      return (
        <div key={i} className="flex gap-2 mt-1.5">
          <span className="text-violet-400 mt-0.5 shrink-0">•</span>
          <p className="text-slate-300 text-sm leading-relaxed">{trimmed.slice(1).trim()}</p>
        </div>
      )
    }

    // Empty lines — small gap
    if (!trimmed) return <div key={i} className="h-1" />

    // Body text (Quick Pitch paragraph etc.)
    return (
      <p key={i} className="text-slate-300 text-sm leading-relaxed mt-1.5">
        {trimmed}
      </p>
    )
  })
}

// ── Main Component ──────────────────────────────────────────────────────────

export function JobMatcher() {
  const [jd, setJd] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  async function analyze() {
    if (jd.trim().length < 50) return
    setStatus('loading')
    setOutput('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setOutput(accumulated)
        outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
      }

      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  function reset() {
    setJd('')
    setOutput('')
    setStatus('idle')
    setErrorMsg('')
  }

  const charCount = jd.length
  const ready = charCount >= 50 && status !== 'loading'

  return (
    <section id="jd-matcher" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/25 flex items-center justify-center">
              <Sparkles size={17} className="text-violet-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">JD Matcher</h2>
          </div>
          <p className="text-slate-400 text-base max-w-2xl">
            Paste any job description and Gemini will stream a real-time analysis of how Sai&apos;s
            background fits: match score, specific evidence, honest gaps, and a ready-to-use pitch.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — JD input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col flex-1 min-h-[360px]">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Job Description
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                disabled={status === 'loading'}
                placeholder="Paste the full job description here: title, responsibilities, requirements, preferred qualifications…"
                maxLength={4000}
                className="flex-1 w-full bg-transparent text-slate-200 placeholder:text-slate-600 text-sm leading-relaxed resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.07]">
                <span className={`text-[11px] font-mono ${charCount < 50 ? 'text-slate-600' : 'text-slate-400'}`}>
                  {charCount}/4000 chars {charCount < 50 ? `(need ${50 - charCount} more)` : ''}
                </span>
                <div className="flex gap-2">
                  {(status === 'done' || status === 'error') && (
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-medium transition-colors"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </button>
                  )}
                  <button
                    onClick={analyze}
                    disabled={!ready}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all duration-200"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        Analyze Fit
                        <ChevronRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — streaming output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              ref={outputRef}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 min-h-[360px] max-h-[520px] overflow-y-auto"
            >
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Match Analysis
              </label>

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <Sparkles size={32} className="text-slate-700 mb-3" />
                    <p className="text-slate-600 text-sm">
                      Paste a job description on the left<br />and click <strong className="text-slate-500">Analyze Fit</strong>
                    </p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  </motion.div>
                )}

                {(status === 'loading' || status === 'done') && output && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {renderOutput(output)}
                    {status === 'loading' && (
                      <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                    )}
                  </motion.div>
                )}

                {status === 'loading' && !output && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 pt-4"
                  >
                    <span className="w-3 h-3 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
                    <span className="text-slate-500 text-sm">Analyzing job description…</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
