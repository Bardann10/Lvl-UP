import { useMemo } from 'react'
import { PageHeader } from '../components/PageHeader'
import { todayKey } from '../utils/date'

export function Statistics({ goals, habits, tasks }) {
  const today = todayKey()
  const completedToday = habits.filter((habit) => habit.completedDates.includes(today)).length
  const totalHabits = habits.length || 1
  const weekly = habits.filter((habit) => habit.completedDates.some((date) => date >= new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))).length
  const monthly = habits.filter((habit) => habit.completedDates.some((date) => date.slice(0, 7) === today.slice(0, 7))).length
  const yearly = habits.filter((habit) => habit.completedDates.some((date) => date.slice(0, 4) === today.slice(0, 4))).length
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
  const heatMap = useMemo(() => Array.from({ length: 35 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (34 - index)); return { date: date.toISOString().slice(0, 10), count: habits.filter((habit) => habit.completedDates.includes(date.toISOString().slice(0, 10))).length }
  }), [habits])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Statistics"
        title="Your momentum, at a glance"
        description="Measure consistency trends and streak depth across daily, weekly, monthly, and yearly views."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Daily completion', `${Math.round((completedToday / totalHabits) * 100)}%`, 'Today'],
          ['Weekly completion', `${Math.round((weekly / totalHabits) * 100)}%`, 'Last 7 days'],
          ['Monthly completion', `${Math.round((monthly / totalHabits) * 100)}%`, 'This month'],
          ['Yearly completion', `${Math.round((yearly / totalHabits) * 100)}%`, 'This year'],
        ].map(([title, value, description]) => (
          <div key={title} className="ui-card p-4">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="ui-card p-5">
          <p className="text-sm text-slate-400">Streaks</p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-white">{currentStreak}</p>
              <p className="text-sm text-slate-500">Current streak</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">{longestStreak}</p>
              <p className="text-sm text-slate-500">Longest streak</p>
            </div>
          </div>
        </div>
        <div className="ui-card p-5">
          <p className="text-sm text-slate-400">Goal completion</p>
          <p className="mt-2 text-3xl font-semibold text-white">{Math.round((goals.filter((goal) => goal.completed).length / Math.max(goals.length, 1)) * 100)}%</p>
        </div>
      </div>
      <div className="ui-card p-5">
        <p className="text-sm text-slate-400">Activity heat map</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {heatMap.map((cell) => (
            <div key={cell.date} className={`h-5 w-5 rounded-sm ${cell.count > 0 ? 'bg-emerald-500' : 'bg-slate-800'}`} title={`${cell.date}: ${cell.count}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
