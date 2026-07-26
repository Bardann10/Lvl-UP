import { Link } from 'react-router-dom'
import { ROUTES } from '../app/router'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 text-base font-semibold text-white">
          <span className="rounded-2xl bg-sky-500/20 p-2 text-sky-400">
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
          </span>
          <span>Level-Up</span>
        </Link>
        <Link
          to={ROUTES.SETTINGS}
          aria-label="Settings"
          className="rounded-full border border-white/10 bg-slate-900/70 p-2.5 text-slate-200 shadow-sm shadow-slate-950/30 transition hover:border-sky-400/50 hover:text-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </div>
    </header>
  )
}
