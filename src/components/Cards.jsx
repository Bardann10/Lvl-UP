export function StatCard({ title, value, description, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-sky-500/15 p-2 text-sky-400">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </div>
  )
}
