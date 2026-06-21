'use client'

import { motion } from 'framer-motion'
import type { PinnedRepo } from '@/lib/types'
import { Star, GitFork, ExternalLink, Globe } from 'lucide-react'

export function ProjectCard({ repo, index }: { repo: PinnedRepo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className="group relative bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-violet-500/50 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
    >
      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors font-mono text-sm">
          {repo.name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {repo.homepageUrl && (
            <a
              href={repo.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              className="text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Globe size={15} />
            </a>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-slate-500 hover:text-violet-400 transition-colors"
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1">
        {repo.description ?? 'No description provided.'}
      </p>

      {/* Live demo button */}
      {repo.homepageUrl && (
        <a
          href={repo.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-500 text-white transition-colors w-fit backdrop-blur-sm"
        >
          <Globe size={12} />
          Live Demo
        </a>
      )}

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {repo.primaryLanguage && (
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: repo.primaryLanguage.color ?? '#7c3aed' }}
              />
              {repo.primaryLanguage.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={12} />
            {repo.stargazerCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} />
            {repo.forkCount}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
