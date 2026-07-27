import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/daily-goals', label: 'Daily Goals', icon: 'track_changes' },
  { to: '/monthly-goals', label: 'Monthly Goals', icon: 'insights' },
  { to: '/yearly-goals', label: 'Yearly Goals', icon: 'military_tech' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar_month' },
]

export function Sidebar({ children }) {
  const location = useLocation()

  return (
    <aside className="glass-strong hidden w-72 shrink-0 rounded-[1.7rem] p-4 lg:flex lg:flex-col">
      <div className="rounded-[1.25rem] border border-sky-300/25 bg-gradient-to-br from-sky-500/22 via-blue-500/10 to-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Focus mode</p>
        <p className="mt-2 text-[1.18rem] font-semibold leading-tight text-white">Stay sharp. Build momentum.</p>
      </div>

      <nav className="mt-5 space-y-2.5">
        {navItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to} className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${active ? 'border-sky-300/35 bg-gradient-to-r from-sky-500/24 to-blue-600/10 text-sky-100 shadow-lg shadow-blue-500/20' : 'border-white/5 text-slate-300 hover:border-sky-300/25 hover:bg-white/[0.045] hover:text-white'}`}>
              <span className={`material-symbols-outlined transition ${active ? 'text-sky-200' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.icon}</span>
              <span className="font-medium tracking-[0.01em]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-5 space-y-3">{children}</div>
    </aside>
  )
}
