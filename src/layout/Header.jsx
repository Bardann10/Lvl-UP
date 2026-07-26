import { Link } from 'react-router-dom'
import { ROUTES } from '../app/router'

export function Header() {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="app-panel-strong mx-auto flex max-w-[88rem] items-center justify-between px-4 py-3 sm:px-5">
        <Link to={ROUTES.HOME} className="flex items-center gap-3 text-[var(--color-text-primary)]">
          <span className="app-icon-badge h-11 w-11">
            <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">Planner</p>
            <span className="block text-lg font-semibold tracking-[-0.03em]">Level-Up</span>
          </div>
        </Link>
        <Link
          to={ROUTES.SETTINGS}
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </Link>
      </div>
    </header>
  )
}
