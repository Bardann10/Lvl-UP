import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/daily-goals', label: 'Daily Goals', icon: 'track_changes' },
  { to: '/monthly-goals', label: 'Monthly Goals', icon: 'insights' },
  { to: '/yearly-goals', label: 'Yearly Goals', icon: 'military_tech' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar_month' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold text-white">
            <span className="rounded-2xl bg-sky-500/20 p-2 text-sky-400">
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            </span>
            <span>Lvl-Up</span>
          </Link>
          <Link to="/settings" className="rounded-full border border-white/10 bg-slate-900/70 p-2.5 text-slate-200 shadow-sm shadow-slate-950/30 transition hover:border-sky-400/50 hover:text-sky-300">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-5xl justify-around gap-1">
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
