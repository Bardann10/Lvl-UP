export function ProgressRing({ label, value, accent = 'sky' }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const fillClass = {
    sky: 'stroke-sky-400',
    emerald: 'stroke-emerald-400',
    violet: 'stroke-violet-400',
  }[accent]

  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90">
          <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="12" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className={fillClass}
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-3xl font-semibold text-white">{Math.round(value)}%</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  )
}
