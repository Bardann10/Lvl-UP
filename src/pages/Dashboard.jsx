import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/Cards'
import { MonthCalendar } from '../components/MonthCalendar'
import { ProgressRing } from '../components/ProgressCards'
import { todayKey, getTodayLabel } from '../utils/date'

export function Dashboard({ dailyGoals, tasks, monthlyGoals, yearlyGoals }) {
  const [viewDate] = useState(new Date())
  const completedHabitsToday = dailyGoals.filter((goal) => goal.completedDates.includes(todayKey())).length
  const completionPercent = Math.round((completedHabitsToday / Math.max(dailyGoals.length, 1)) * 100)
  const monthlyDone = monthlyGoals.filter((goal) => goal.completed).length
  const yearlyDone = yearlyGoals.filter((goal) => goal.completed).length
  const activeStreak = dailyGoals.reduce((highest, goal) => Math.max(highest, goal.streak || 0), 0)
  const upcomingTasks = tasks.filter((task) => !task.completed).slice(0, 3)
  const quote = 'Consistency beats intensity when the work is repeated.'
  const monthlyProgress = useMemo(() => Math.round((monthlyDone / Math.max(monthlyGoals.length, 1)) * 100), [monthlyDone, monthlyGoals.length])
  const yearlyProgress = useMemo(() => Math.round((yearlyDone / Math.max(yearlyGoals.length, 1)) * 100), [yearlyDone, yearlyGoals.length])

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-violet-500/20 p-6 shadow-2xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Level up your daily momentum.</h1>
        <p className="mt-3 max-w-2xl text-slate-300">{getTodayLabel()} is your reset point. Keep the streak alive and stay consistent.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/daily-goals" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">View Daily Goals</Link>
          <Link to="/achievements" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">See achievements</Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Today&apos;s progress</p>
              <p className="text-xl font-semibold text-white">{completedHabitsToday}/{dailyGoals.length} goals completed</p>
            </div>
            <Link to="/daily-goals" className="text-sm text-sky-400">Manage goals</Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ProgressRing label="Today" value={completionPercent} accent="sky" />
            <div className="space-y-3">
              <StatCard title="Current streak" value={activeStreak} description="Longest active streak across habits" icon="auto_awesome" />
              <StatCard title="Monthly goals" value={monthlyDone} description="Goals marked complete" icon="insights" />
              <StatCard title="Yearly goals" value={yearlyDone} description="Milestones completed" icon="military_tech" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
          <p className="text-sm text-slate-400">Quick navigation</p>
          <div className="mt-4 grid gap-3">
            {[
              ['Daily Goals', '/daily-goals', 'track_changes'],
              ['To-Do Tasks', '/to-do-tasks', 'task_alt'],
              ['Achievements', '/achievements', 'workspace_premium'],
              ['Statistics', '/statistics', 'bar_chart'],
            ].map(([label, to, icon]) => (
              <Link key={to} to={to} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-200 transition hover:-translate-y-0.5 hover:border-sky-400/40">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-400">{icon}</span>
                  {label}
                </span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Monthly calendar</p>
            <Link to="/calendar" className="text-sm text-sky-400">Open calendar</Link>
          </div>
          <div className="mt-4">
            <MonthCalendar dailyGoals={dailyGoals} selectedDate={todayKey()} onSelectDate={() => {}} viewDate={viewDate} compact />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Upcoming to-do tasks</p>
            <Link to="/to-do-tasks" className="text-sm text-sky-400">Open planner</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No upcoming tasks yet. Add one to stay ahead.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.date} • {task.priority}</p>
                  </div>
                  <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs text-sky-300">{task.reminderTime || 'Any time'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
          <p className="text-sm text-slate-400">Progress snapshot</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Monthly progress</span>
                <span className="font-semibold text-white">{monthlyProgress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-sky-400" style={{ width: `${monthlyProgress}%` }} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Yearly progress</span>
                <span className="font-semibold text-white">{yearlyProgress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-violet-400" style={{ width: `${yearlyProgress}%` }} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Quote of the day</p>
          <p className="mt-3 text-lg font-semibold text-white">“{quote}”</p>
          <p className="mt-2 text-sm text-slate-500">Small wins compound into major momentum.</p>
        </div>
      </div>
    </div>
  )
}
