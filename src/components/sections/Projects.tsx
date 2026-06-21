import type { PinnedRepo } from '@/lib/types'
import { ProjectCard } from '@/components/ui/ProjectCard'

export function Projects({ repos }: { repos: PinnedRepo[] }) {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Live Projects
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-xl">
            Auto-synced from GitHub pinned repositories. Pin a new repo and it appears here automatically.
          </p>
        </div>

        {repos.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="font-mono text-sm">No pinned repositories found.</p>
            <p className="text-xs mt-2">Pin repositories on GitHub to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {repos.map((repo, i) => (
              <ProjectCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
