export function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <div className={`ui-page-header p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? <p className="ui-page-header-eyebrow">{eyebrow}</p> : null}
          <h2 className="ui-page-header-title mt-2 text-2xl font-semibold sm:text-[2rem]">{title}</h2>
          {description ? <p className="ui-page-header-description mt-3 max-w-3xl text-sm sm:text-base">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
