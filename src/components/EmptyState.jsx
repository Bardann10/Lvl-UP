export function EmptyState({ title, description, action }) {
  return (
    <div className="ui-card border-dashed p-8 text-center text-slate-300">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/25 bg-sky-500/10 text-sky-200">
        <span className="material-symbols-outlined">inbox</span>
      </div>
      <p className="text-lg font-semibold tracking-[-0.01em] text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
