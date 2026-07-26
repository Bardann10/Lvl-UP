export function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseClassName =
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'border border-transparent bg-[var(--gradient-accent)] text-[var(--color-text-inverse)] focus-visible:outline-[var(--color-ring)]',
    secondary:
      'border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] focus-visible:outline-[var(--color-ring)]',
    ghost:
      'border border-transparent bg-transparent text-[var(--color-text-secondary)] shadow-none hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)] focus-visible:outline-[var(--color-ring)]',
    danger:
      'border border-transparent bg-[var(--color-danger-soft)] text-[var(--color-danger)] focus-visible:outline-[var(--color-danger)]',
  }

  return (
    <button className={`${baseClassName} ${variants[variant] ?? variants.primary} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
