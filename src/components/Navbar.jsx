import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/daily-goals', label: 'Daily Goals', icon: 'track_changes' },
  { to: '/to-do-tasks', label: 'To-Do Tasks', icon: 'task_alt' },
  { to: '/monthly-goals', label: 'Monthly Goals', icon: 'insights' },
  { to: '/yearly-goals', label: 'Yearly Goals', icon: 'military_tech' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar_month' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/statistics', label: 'Statistics', icon: 'bar_chart' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="rounded-2xl bg-sky-500/20 p-2 text-sky-400">
            <span className="material-symbols-outlined">rocket_launch</span>
          </span>
          Lvl-UP
        </Link>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-sm ${active ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
              >
                <span className="mr-1 material-symbols-outlined align-middle text-sm">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
