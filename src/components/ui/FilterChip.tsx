'use client'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
          : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-brand-400 hover:text-brand-500 dark:hover:text-brand-400'
      }`}
    >
      {label}
    </button>
  )
}
