export function ProgressRing({ label, value, accent = 'sky' }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const accentClasses = {
    sky: 'stroke-sky-400',
    emerald: 'stroke-emerald-400',
    violet: 'stroke-violet-400',
    amber: 'stroke-amber-400',
  }[accent] ?? 'stroke-sky-400'

  return (
    <div className="app-panel-soft flex flex-col items-center gap-4 p-6 text-center">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90" aria-hidden="true">
          <circle cx="70" cy="70" r={radius} stroke="rgba(148, 163, 184, 0.18)" strokeWidth="11" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            className={accentClasses}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              filter: 'var(--filter-accent-glow)',
            }}
          />
        </svg>
        <div className="absolute text-center" aria-label={`${Math.round(value)}% ${label}`}>
          <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">{Math.round(value)}%</p>
          <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">{label}</p>
        </div>
      </div>
    </div>
  )
}
