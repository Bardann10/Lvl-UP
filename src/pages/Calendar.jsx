import { useMemo, useState } from 'react'
import { MonthCalendar } from '../components/MonthCalendar'
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

  const changeMonth = (direction) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  const jumpToToday = () => {
    const today = new Date()
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(todayKey())
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
        <p className="text-sm text-slate-400">Calendar</p>
        <h2 className="text-2xl font-semibold text-white">Monthly overview</h2>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/20 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">{viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
            <p className="text-xl font-semibold text-white">Plan your momentum</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => changeMonth(-1)} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">Previous</button>
            <button type="button" onClick={jumpToToday} className="rounded-full bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950">Today</button>
            <button type="button" onClick={() => changeMonth(1)} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">Next</button>
          </div>
        </div>
        <div className="mt-5">
          <MonthCalendar dailyGoals={dailyGoals} selectedDate={selectedDate} onSelectDate={setSelectedDate} viewDate={viewDate} />
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Selected day</p>
            <p className="text-xl font-semibold text-white">{formatLongDate(selectedDate)}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">{selectedCompletionPercent}% completed</div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-white">Daily goals</p>
            {dailyGoals.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No daily goals yet for this day.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {dailyGoals.map((goal) => {
                  const completed = goal.completedDates.includes(selectedDate)
                  return (
                    <div key={goal.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{goal.title}</p>
                        <p className="text-xs text-slate-400">{goal.category}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                        {completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-white">To-do tasks</p>
            {selectedTasks.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No tasks scheduled for this day.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {selectedTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-100">{task.title}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                        {task.completed ? 'Done' : 'Planned'}
                      </span>
                    </div>
                    {task.description && <p className="mt-1 text-xs text-slate-400">{task.description}</p>}
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
