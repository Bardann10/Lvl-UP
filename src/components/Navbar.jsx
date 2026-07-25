import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/daily-goals', label: 'Daily Goals', icon: 'track_changes' },
  { to: '/to-do-tasks', label: 'To-Do Tasks', icon: 'task_alt' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar_month' },
  { to: '/monthly-goals', label: 'Monthly Goals', icon: 'insights' },
  { to: '/yearly-goals', label: 'Yearly Goals', icon: 'military_tech' },
  { to: '/statistics', label: 'Statistics', icon: 'bar_chart' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <>
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="rounded-2xl bg-sky-500/20 p-2 text-sky-400">
              <span className="material-symbols-outlined">rocket_launch</span>
            </span>
            Lvl-Up
          </Link>
          <div className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">{location.pathname === '/' ? 'Home' : navItems.find((item) => item.to === location.pathname)?.label || 'Menu'}</div>
        </div>
      </nav>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl justify-around">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to} className={`flex flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] ${active ? 'bg-sky-500/15 text-sky-300' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span className="mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
