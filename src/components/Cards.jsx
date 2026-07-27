export function StatCard({ title, value, description, icon }) {
  return (
    <div className="ui-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-300">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-sky-300/30 bg-gradient-to-br from-sky-400/30 to-blue-500/10 p-2 text-sky-200">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </div>
  )
}
