export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="app-panel app-fade-in p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[2.35rem]">
            {title}
          </h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-tertiary)] sm:text-base">{subtitle}</p> : null}
        </div>
        {action ? <div className="w-full shrink-0 lg:w-auto">{action}</div> : null}
      </div>
    </div>
  )
}
