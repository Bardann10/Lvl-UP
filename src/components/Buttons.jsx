export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
  }

  return (
    <button
      className={`rounded-2xl px-4 py-2 font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
