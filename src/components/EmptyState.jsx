export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-8 text-center text-slate-400">
      <p className="text-lg font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
      {action}
    </div>
  )
}
