import type { ResumeBasics } from '@/lib/types'
import { Code2, Briefcase, Mail } from 'lucide-react'

export function Footer({ basics }: { basics: ResumeBasics }) {
  const github   = basics.profiles.find((p) => p.network === 'GitHub')
  const linkedin = basics.profiles.find((p) => p.network === 'LinkedIn')

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
          &copy; {new Date().getFullYear()} {basics.name}
        </p>
        <div className="flex items-center gap-4">
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              <Code2 size={18} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              <Briefcase size={18} />
            </a>
          )}
          <a
            href={`mailto:${basics.email}`}
            aria-label="Email"
            className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
