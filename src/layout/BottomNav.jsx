import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../app/router'

export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-5xl justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 ${
                active ? 'bg-sky-500/15 text-sky-300' : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
