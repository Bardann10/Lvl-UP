/**
 * PageHeader – standardised header section at the top of every page.
 *
 * @param {string}      eyebrow   - Small label above the title (e.g. "Settings").
 * @param {string}      title     - Main heading.
 * @param {string}      [subtitle]- Optional supporting text below the title.
 * @param {ReactNode}   [action]  - Optional call-to-action rendered bottom-right.
 */
export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="text-sm text-slate-400">{eyebrow}</p>}
          <h2 className="mt-0.5 text-2xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
