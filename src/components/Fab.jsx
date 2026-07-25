export function Fab({ onClick, label = '+' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-3xl font-semibold text-slate-950 shadow-2xl shadow-sky-500/30 transition hover:scale-105"
    >
      {label}
    </button>
  )
}
