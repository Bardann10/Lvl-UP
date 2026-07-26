import { useMemo } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { todayKey } from '../utils/date'

export function Statistics({ goals, habits }) {
  const today = todayKey()
  const completedToday = habits.filter((habit) => habit.completedDates.includes(today)).length
  const totalHabits = habits.length || 1
  const weekly = habits.filter((habit) => habit.completedDates.some((date) => date >= new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))).length
  const monthly = habits.filter((habit) => habit.completedDates.some((date) => date.slice(0, 7) === today.slice(0, 7))).length
  const yearly = habits.filter((habit) => habit.completedDates.some((date) => date.slice(0, 4) === today.slice(0, 4))).length
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
  const heatMap = useMemo(
    () =>
      Array.from({ length: 35 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (34 - index))
        return {
          date: date.toISOString().slice(0, 10),
          count: habits.filter((habit) => habit.completedDates.includes(date.toISOString().slice(0, 10))).length,
        }
      }),
    [habits],
  )

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Statistics"
        title="Your momentum, at a glance"
        subtitle="Clean visual summaries highlight progress, streaks, and activity without touching planner behavior."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Daily completion', `${Math.round((completedToday / totalHabits) * 100)}%`, 'Today'],
          ['Weekly completion', `${Math.round((weekly / totalHabits) * 100)}%`, 'Last 7 days'],
          ['Monthly completion', `${Math.round((monthly / totalHabits) * 100)}%`, 'This month'],
          ['Yearly completion', `${Math.round((yearly / totalHabits) * 100)}%`, 'This year'],
        ].map(([title, value, description]) => (
          <div key={title} className="app-panel p-5 sm:p-6">
            <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--color-text-primary)]">{value}</p>
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">{description}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="app-panel p-5 sm:p-6">
          <p className="text-sm text-[var(--color-text-muted)]">Streaks</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="app-list-item p-4">
              <p className="text-4xl font-semibold tracking-[-0.05em] text-[var(--color-text-primary)]">{currentStreak}</p>
              <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">Current streak</p>
            </div>
            <div className="app-list-item p-4">
              <p className="text-4xl font-semibold tracking-[-0.05em] text-[var(--color-text-primary)]">{longestStreak}</p>
              <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">Longest streak</p>
            </div>
          </div>
        </div>
        <div className="app-panel p-5 sm:p-6">
          <p className="text-sm text-[var(--color-text-muted)]">Goal completion</p>
          <p className="mt-3 text-5xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)]">
            {Math.round((goals.filter((goal) => goal.completed).length / Math.max(goals.length, 1)) * 100)}%
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">A quick view into how much of this cycle has been completed.</p>
        </div>
      </div>
      <div className="app-panel p-5 sm:p-6">
        <p className="text-sm text-[var(--color-text-muted)]">Activity heat map</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {heatMap.map((cell) => (
            <div
              key={cell.date}
              className={`h-6 w-6 rounded-[0.7rem] ${cell.count > 0 ? 'bg-emerald-400 shadow-[0_10px_24px_-14px_rgba(110,231,183,0.8)]' : 'bg-[var(--color-surface-soft)]'}`}
              title={`${cell.date}: ${cell.count}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
