import { useMemo } from 'react'
import { getCompletedHabitsByDate, todayKey } from '../utils/date'

export function Calendar({ dailyGoals, tasks, monthlyGoals }) {
  const completedHabitsByDate = useMemo(() => getCompletedHabitsByDate(dailyGoals), [dailyGoals])
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - index)
    return date.toISOString().slice(0, 10)
  }).reverse()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Calendar</p>
        <h2 className="text-2xl font-semibold text-white">Completed habits by date</h2>
      </div>

      <div className="grid gap-3">
        {dates.map((date) => (
          <div key={date} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <p className={`text-lg font-semibold ${date === todayKey() ? 'text-sky-400' : 'text-white'}`}>{date}</p>
              <p className="text-sm text-slate-400">{completedHabitsByDate[date]?.length || 0} daily goals • {tasks.filter((task) => task.date === date).length} tasks</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(completedHabitsByDate[date] || []).map((habit) => (
                <span key={`${date}-${habit}`} className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                  {habit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
