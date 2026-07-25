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
    <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-slate-950/30 lg:flex lg:flex-col">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-500/20 to-violet-500/20 p-4">
        <p className="text-sm text-slate-300">Focus mode</p>
        <p className="mt-2 text-xl font-semibold text-white">Stay sharp. Build momentum.</p>
      </div>

      <nav className="mt-5 space-y-2">
        {navItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${active ? 'bg-sky-500/15 text-sky-300 shadow-lg shadow-sky-500/10' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <span className={`material-symbols-outlined ${active ? 'text-sky-300' : 'text-slate-400'}`}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-5 space-y-3">{children}</div>
    </aside>
  )
}
