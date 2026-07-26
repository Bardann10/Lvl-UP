import { useMemo, useState } from 'react'
import { MonthCalendar } from '../shared/ui/MonthCalendar'
import { PageHeader } from '../shared/ui/PageHeader'
import { formatLongDate, todayKey } from '../utils/date'

function toDateKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function Calendar({ dailyGoals, tasks }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(todayKey())

  const selectedTasks = useMemo(() => tasks.filter((task) => task.date === selectedDate), [selectedDate, tasks])
  const selectedGoals = useMemo(() => dailyGoals.filter((goal) => goal.completedDates.includes(selectedDate)), [dailyGoals, selectedDate])
  const selectedGoalCount = dailyGoals.length
  const selectedCompletionPercent = selectedGoalCount === 0 ? 0 : Math.round((selectedGoals.length / selectedGoalCount) * 100)

  const weeklyCompletion = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    const completed = dailyGoals.filter((goal) =>
      goal.completedDates.some((date) => {
        const target = new Date(date)
        return target >= start && target <= end
      }),
    ).length
    return dailyGoals.length === 0 ? 0 : Math.round((completed / dailyGoals.length) * 100)
  }, [dailyGoals])

  const monthlyCompletion = useMemo(() => {
    const now = new Date()
    const completed = dailyGoals.filter((goal) =>
      goal.completedDates.some((date) => {
        const target = new Date(date)
        return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear()
      }),
    ).length
    return dailyGoals.length === 0 ? 0 : Math.round((completed / dailyGoals.length) * 100)
  }, [dailyGoals])

  const streaks = useMemo(() => dailyGoals.reduce((max, goal) => Math.max(max, goal.streak || 0), 0), [dailyGoals])

  const trend = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (5 - index))
        const key = toDateKey(date)
        const completed = dailyGoals.filter((goal) => goal.completedDates.includes(key)).length
        return { label: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count: completed }
      }),
    [dailyGoals],
  )

  const changeMonth = (direction) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  const jumpToToday = () => {
    const today = new Date()
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(todayKey())
  }

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Calendar" title="Monthly overview" subtitle="See routines, tasks, and momentum in one elegant calendar view." />

      <div className="app-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">{viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Plan your momentum</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLike onClick={() => changeMonth(-1)} label="Previous" />
            <ButtonLike onClick={jumpToToday} label="Today" active />
            <ButtonLike onClick={() => changeMonth(1)} label="Next" />
          </div>
        </div>
        <div className="mt-5">
          <MonthCalendar dailyGoals={dailyGoals} selectedDate={selectedDate} onSelectDate={setSelectedDate} viewDate={viewDate} />
        </div>
      </div>

      <div className="app-panel p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Selected day</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{formatLongDate(selectedDate)}</p>
          </div>
          <div className="app-chip px-4 py-2.5 text-sm font-semibold">{selectedCompletionPercent}% completed</div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ['Weekly completion', `${weeklyCompletion}%`],
            ['Monthly completion', `${monthlyCompletion}%`],
            ['Streaks', `${streaks} days`],
          ].map(([label, value]) => (
            <div key={label} className="app-list-item p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{value}</p>
            </div>
          ))}
          <div className="app-list-item p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Trend</p>
            <div className="mt-3 flex items-end gap-1.5">
              {trend.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full rounded-full bg-[var(--color-accent-soft)]" style={{ height: `${Math.max(10, point.count * 10)}px` }} />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="app-list-item p-4 sm:p-5">
            <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Daily goals</p>
            {dailyGoals.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">No daily goals yet for this day.</p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {dailyGoals.map((goal) => {
                  const completed = goal.completedDates.includes(selectedDate)
                  return (
                    <div key={goal.id} className="app-inset flex items-center justify-between gap-3 px-3 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{goal.title}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{goal.category}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${completed ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]'}`}>
                        {completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="app-list-item p-4 sm:p-5">
            <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">To-do tasks</p>
            {selectedTasks.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">No tasks scheduled for this day.</p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {selectedTasks.map((task) => (
                  <div key={task.id} className="app-inset px-3 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{task.title}</p>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${task.completed ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]'}`}>
                        {task.completed ? 'Done' : 'Planned'}
                      </span>
                    </div>
                    {task.description ? <p className="mt-2 text-xs leading-5 text-[var(--color-text-tertiary)]">{task.description}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ButtonLike({ onClick, label, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
        active ? 'app-chip app-chip-active' : 'app-chip hover:-translate-y-0.5 hover:text-[var(--color-text-primary)]'
      }`}
    >
      {label}
    </button>
  )
}
