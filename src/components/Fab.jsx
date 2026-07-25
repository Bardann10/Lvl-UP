export function Fab({ onClick, label = '+' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-3xl font-semibold text-slate-950 shadow-2xl shadow-sky-500/30 transition hover:scale-105 sm:right-6 lg:bottom-6"
    >
      {label}
    </button>
  )
}
