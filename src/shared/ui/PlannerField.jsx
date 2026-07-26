const BASE_FIELD_CLASSES =
  'w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] backdrop-blur-xl placeholder:text-[var(--color-text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]'

const SIZE_CLASSES = {
  sm: 'px-3 py-2.5 text-sm',
  md: 'px-4 py-3 text-sm sm:text-[0.95rem]',
  lg: 'px-4 py-3.5 text-[0.95rem] sm:text-base',
}

function getFieldClassName(size, className = '') {
  return `${BASE_FIELD_CLASSES} ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${className}`.trim()
}

export function PlannerInput({ className = '', size = 'md', ...props }) {
  return <input className={getFieldClassName(size, className)} {...props} />
}

export function PlannerTextarea({ className = '', size = 'md', ...props }) {
  return <textarea className={getFieldClassName(size, className)} {...props} />
}

export function PlannerSelect({ className = '', size = 'md', children, ...props }) {
  return (
    <select className={getFieldClassName(size, className)} {...props}>
      {children}
    </select>
  )
}
