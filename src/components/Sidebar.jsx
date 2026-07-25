export function Sidebar({ children }) {
  return (
    <aside className="hidden w-72 shrink-0 rounded-3xl border border-white/10 bg-slate-900/70 p-4 lg:block">
      <div className="rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 p-4">
        <p className="text-sm text-slate-300">Focus mode</p>
        <p className="mt-2 text-xl font-semibold text-white">Stay sharp. Build momentum.</p>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </aside>
  )
}
