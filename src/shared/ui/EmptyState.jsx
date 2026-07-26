export function EmptyState({ title, description, action }) {
  return (
    <div className="app-panel app-fade-in border-dashed p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface-soft)] text-[var(--color-accent)] shadow-[var(--shadow-soft)]">
        <span className="material-symbols-outlined text-[26px]">spark</span>
      </div>
      <p className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-tertiary)] sm:text-base">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
