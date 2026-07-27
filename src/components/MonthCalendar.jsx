import { useMemo } from 'react'
import { todayKey } from '../utils/date'

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
      {showHeader && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-400">Monthly view</p>
          <p className="text-sm font-semibold text-slate-200">{viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:gap-2 sm:text-xs">
        {dayNames.map((dayName) => (
          <div key={dayName} className="py-1">
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
            green: 'bg-emerald-500',
            yellow: 'bg-amber-400',
            red: 'bg-rose-500',
            grey: 'bg-slate-700',
          }[status]

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate?.(dateKey)}
              className={`flex min-h-[3rem] flex-col items-center justify-center rounded-2xl border px-1 py-2 text-sm transition ${
                cell.isCurrentMonth ? 'border-white/12 bg-slate-900/72 text-slate-100 hover:border-sky-300/35 hover:bg-slate-900/90' : 'border-white/5 bg-slate-950/45 text-slate-500'
              } ${dayIsSelected ? 'ring-2 ring-sky-400/60 shadow-lg shadow-sky-500/20' : ''} ${compact ? 'min-h-[2.6rem] rounded-[14px]' : ''}`}
            >
              <span className={`text-sm ${dayIsToday ? 'font-semibold text-sky-400' : 'font-medium'}`}>{cell.date.getDate()}</span>
              <span className={`mt-2 h-2.5 w-2.5 rounded-full ${indicatorClasses} ${!cell.isCurrentMonth ? 'opacity-50' : ''}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
