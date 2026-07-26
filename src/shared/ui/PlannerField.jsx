const BASE_FIELD_CLASSES =
  'border border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400'

const SIZE_CLASSES = {
  sm: 'rounded-2xl px-3 py-2',
  md: 'rounded-2xl px-3 py-3',
  lg: 'rounded-2xl px-4 py-3',
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
