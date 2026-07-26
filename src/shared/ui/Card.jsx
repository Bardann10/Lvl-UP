export function Card({ children, className = '' }) {
  return <div className={`app-panel p-5 sm:p-6 ${className}`.trim()}>{children}</div>
}

export function StatCard({ title, value, description, icon }) {
  return (
    <Card className="app-fade-in p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{value}</p>
        </div>
        <div className="app-icon-badge h-12 w-12">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">{description}</p>
    </Card>
  )
}
