import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../app/router'

export function BottomNav() {
  const location = useLocation()

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-4 z-30 px-3 lg:hidden">
      <div className="app-panel-strong mx-auto flex max-w-xl justify-around gap-1.5 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center rounded-[1.15rem] px-2 py-2.5 text-[11px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                active
                  ? 'bg-[var(--gradient-accent)] text-slate-950 shadow-[var(--shadow-soft)]'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span className="mt-1 truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
