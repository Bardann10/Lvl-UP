import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../app/router'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside
      aria-label="Main navigation"
      className="hidden w-72 shrink-0 rounded-[2rem] border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-slate-950/30 lg:flex lg:flex-col"
    >
      <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-500/20 to-violet-500/20 p-4">
        <p className="text-sm text-slate-300">Focus mode</p>
        <p className="mt-2 text-xl font-semibold text-white">Stay sharp. Build momentum.</p>
      </div>

      <nav className="mt-5 space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 ${
                active
                  ? 'bg-sky-500/15 text-sky-300 shadow-lg shadow-sky-500/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${active ? 'text-sky-300' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
        <p className="font-semibold text-white">Today&apos;s focus</p>
        <p className="mt-1">Keep your streak strong and your priorities clear.</p>
      </div>
    </aside>
  )
}
