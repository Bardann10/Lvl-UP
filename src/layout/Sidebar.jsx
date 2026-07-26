import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../app/router'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside
      aria-label="Main navigation"
      className="app-panel-strong sticky top-28 hidden h-fit w-80 shrink-0 p-5 lg:flex lg:flex-col"
    >
      <div className="rounded-[calc(var(--radius-card)-0.2rem)] border border-[var(--color-border)] bg-[var(--gradient-hero)] p-5 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Focus mode</p>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
          Stay sharp. Build momentum.
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">
          Keep your goals visible, your tasks intentional, and your routines beautifully organized.
        </p>
      </div>

      <nav className="mt-5 space-y-2.5">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                active
                  ? 'border border-transparent bg-[var(--gradient-accent)] text-slate-950 shadow-[var(--shadow-float)]'
                  : 'border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${active ? 'text-slate-950' : 'text-[var(--color-accent)]'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="app-panel-soft mt-5 p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Today&apos;s focus</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">
          Protect your attention, finish the essentials, and let the streak compound.
        </p>
      </div>
    </aside>
  )
}
