'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot } from 'lucide-react'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What AI projects has Sai built?',
  "What's his experience with RAG pipelines?",
  'Tell me about the ArchGuard project',
  'Is Sai open to new opportunities?',
]

export function ChatWidget() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [messages, open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim() || isStreaming) return
    setError(null)

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: userContent }
    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userContent }],
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error(res.status === 503 ? 'Chat not configured' : 'Request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snapshot = accumulated
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m))
        )
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsStreaming(false)
    }
  }, [messages, isStreaming])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  const showSuggestions = messages.length === 0

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            initial={{ scale: prefersReducedMotion ? 1 : 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: prefersReducedMotion ? 1 : 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Open AI chat about Sai"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-105 active:scale-100 transition-all duration-200"
          >
            <Sparkles size={16} className="shrink-0" />
            Ask AI about Sai
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-label="AI assistant about Sai"
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[390px] h-[520px] flex flex-col rounded-2xl border border-white/10 bg-slate-900/96 backdrop-blur-xl shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <Bot size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">Ask about Sai</p>
                  <p className="text-[10px] text-slate-400 font-mono">Powered by Gemini · resume context loaded</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {showSuggestions && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500 text-center">Try one of these or type your own</p>
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] text-slate-300 hover:bg-violet-500/15 hover:border-violet-500/40 hover:text-white transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'bg-white/[0.07] text-slate-200 border border-white/10 rounded-bl-sm'
                    }`}
                  >
                    {m.content || (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <p className="text-xs text-red-400 text-center px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                  {error}. Try emailing <a href="mailto:saiphanikrishna05@gmail.com" className="underline">directly</a>.
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Sai…"
                  disabled={isStreaming}
                  maxLength={2000}
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="p-1 rounded-lg text-slate-400 hover:text-violet-400 disabled:opacity-40 transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
