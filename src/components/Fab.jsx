export function Fab({ onClick, label = '+' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-sky-200/40 bg-gradient-to-br from-sky-400 to-blue-600 text-3xl font-semibold text-white shadow-2xl shadow-blue-600/35 transition duration-200 hover:-translate-y-0.5 hover:shadow-blue-600/45 sm:right-6 lg:bottom-6"
    >
      {label}
    </button>
  )
}
