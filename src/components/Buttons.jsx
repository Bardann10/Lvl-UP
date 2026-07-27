export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'ui-btn ui-btn-primary',
    secondary: 'ui-btn ui-btn-secondary',
    ghost: 'ui-btn ui-btn-ghost',
  }

  return (
    <button
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
