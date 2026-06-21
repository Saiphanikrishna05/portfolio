'use client'

import { useState } from 'react'
import type { ResumeBasics } from '@/lib/types'
import { Code2, Briefcase, Mail, Send } from 'lucide-react'

export function Contact({ basics }: { basics: ResumeBasics }) {
  const github   = basics.profiles.find((p) => p.network === 'GitHub')
  const linkedin = basics.profiles.find((p) => p.network === 'LinkedIn')

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Replace the action URL with your Formspree or similar endpoint
    const action = process.env.NEXT_PUBLIC_FORM_ENDPOINT
    if (!action) {
      setStatus('error')
      return
    }
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left col */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Let&apos;s Connect
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Open to full-time ML/AI engineering roles, research collaborations, and interesting projects.
              Drop a message or reach out via any of the channels below.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${basics.email}`}
                className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                <Mail size={18} className="text-brand-500" />
                {basics.email}
              </a>
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <Code2 size={18} className="text-brand-500" />
                  github.com/{github.username}
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <Briefcase size={18} className="text-brand-500" />
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>

          {/* Right col — contact form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-surface-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
            >
              <Send size={15} />
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Send Message'}
            </button>
            {status === 'error' && (
              <p className="text-xs text-red-500 text-center">
                Something went wrong. Try emailing directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
