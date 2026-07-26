/**
 * Fab – Floating Action Button.
 * Positioned fixed on screen. Visible on all breakpoints;
 * bottom offset accounts for the mobile BottomNav.
 */
export function Fab({ onClick, label = '+', ariaLabel = 'Quick add' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-3xl font-semibold text-slate-950 shadow-2xl shadow-sky-500/30 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300 sm:right-6 lg:bottom-6"
    >
      {label}
    </button>
  )
}
