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
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-5">
          <Link to="/" className="group flex items-center gap-3 text-base font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-300/30 bg-gradient-to-br from-sky-400/35 to-blue-500/20 text-sky-100 shadow-lg shadow-blue-500/20 transition group-hover:-translate-y-0.5">
              <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
            </span>
            <span className="tracking-[-0.01em]">Lvl-Up</span>
          </Link>
          <Link to="/settings" className="ui-btn ui-btn-secondary rounded-full p-2.5">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/72 px-2 pb-2 pt-1.5 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-5xl justify-around gap-1 rounded-[1.1rem] border border-white/10 bg-slate-900/55 p-1.5 shadow-xl shadow-slate-950/45">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to} className={`flex flex-1 flex-col items-center rounded-xl px-2 py-2 text-[11px] transition ${active ? 'bg-gradient-to-b from-sky-400/35 to-blue-600/20 text-sky-100 shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
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
