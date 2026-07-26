export function Fab({ onClick, label = '+', ariaLabel = 'Quick add' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-24 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--gradient-accent)] text-3xl font-semibold text-slate-950 shadow-[var(--shadow-float)] transition hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] sm:right-6 lg:bottom-8 lg:right-8"
    >
      {label}
    </button>
  )
}
