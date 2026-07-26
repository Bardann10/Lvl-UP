import { useMemo } from 'react'
import { todayKey } from '../../utils/date'

function toDateKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDayStatus(dateKey, dailyGoals = []) {
  if (!dailyGoals.length) return 'grey'
  const completedCount = dailyGoals.filter((goal) => goal.completedDates.includes(dateKey)).length
  if (completedCount === 0) return 'red'
  if (completedCount === dailyGoals.length) return 'green'
  return 'yellow'
}

export function MonthCalendar({
  dailyGoals = [],
  selectedDate,
  onSelectDate,
  viewDate,
  compact = false,
  showHeader = false,
}) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startOffset = firstDay.getDay()
    const cells = []

    for (let index = startOffset - 1; index >= 0; index -= 1) {
      const date = new Date(year, month, -index)
      cells.push({ date, isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - daysInMonth - startOffset + 1
      cells.push({ date: new Date(year, month + 1, nextDay), isCurrentMonth: false })
    }

    return cells
  }, [viewDate])

  return (
    <div>
      {showHeader ? (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">Monthly view</p>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)] sm:gap-2 sm:text-[0.72rem]">
        {dayNames.map((dayName) => (
          <div key={dayName} className="py-1.5">
            {dayName}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((cell) => {
          const dateKey = toDateKey(cell.date)
          const status = getDayStatus(dateKey, dailyGoals)
          const dayIsToday = dateKey === todayKey()
          const dayIsSelected = dateKey === selectedDate
          const indicatorClasses = {
            green: 'bg-emerald-400',
            yellow: 'bg-amber-400',
            red: 'bg-rose-400',
            grey: 'bg-slate-500/70',
          }[status]

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate?.(dateKey)}
              aria-label={dateKey}
              aria-pressed={dayIsSelected}
              className={`group flex min-h-[3.6rem] flex-col items-center justify-center rounded-[1.2rem] border px-1 py-2.5 text-sm transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                cell.isCurrentMonth
                  ? 'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-primary)]'
                  : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] opacity-70'
              } ${dayIsSelected ? 'border-transparent bg-[var(--gradient-accent)] text-slate-950 shadow-[var(--shadow-soft)]' : ''} ${compact ? 'min-h-[3rem] rounded-[1rem]' : ''}`}
            >
              <span className={`text-sm ${dayIsToday ? 'font-semibold' : 'font-medium'} ${dayIsSelected ? 'text-slate-950' : ''}`}>
                {cell.date.getDate()}
              </span>
              <span className={`mt-2 h-2.5 w-2.5 rounded-full ${indicatorClasses} ${!cell.isCurrentMonth ? 'opacity-50' : ''} ${dayIsSelected ? 'bg-slate-950/80' : ''}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
