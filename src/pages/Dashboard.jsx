import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { todayKey, getTodayLabel } from '../utils/date'
import { calculateCurrentStreak, calculatePerfectDays } from '../utils/habitMetrics'

export function Dashboard({ dailyGoals, tasks, monthlyGoals, yearlyGoals, achievements, setAchievements, bestStreak = 0 }) {
  const today = todayKey()
  const completedHabitsToday = dailyGoals.filter((goal) => goal.completedDates.includes(todayKey())).length
  const completionPercent = Math.round((completedHabitsToday / Math.max(dailyGoals.length, 1)) * 100)
  const monthlyDone = monthlyGoals.filter((goal) => goal.completed).length
  const yearlyDone = yearlyGoals.filter((goal) => goal.completed).length
  const activeStreak = useMemo(() => calculateCurrentStreak(dailyGoals), [dailyGoals])
  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.date >= today)
    .slice(0, 3)
  const monthlyProgress = useMemo(() => Math.round((monthlyDone / Math.max(monthlyGoals.length, 1)) * 100), [monthlyDone, monthlyGoals.length])
  const yearlyProgress = useMemo(() => Math.round((yearlyDone / Math.max(yearlyGoals.length, 1)) * 100), [yearlyDone, yearlyGoals.length])
  const perfectDays = useMemo(() => calculatePerfectDays(dailyGoals), [dailyGoals])
  const dailyPreview = dailyGoals.slice(0, 4)
  const monthlyPreview = monthlyGoals.slice(0, 4)
  const progressRadius = 78
  const progressCircumference = 2 * Math.PI * progressRadius
  const progressOffset = progressCircumference - (completionPercent / 100) * progressCircumference

  void achievements
  void setAchievements

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <section className="rounded-[24px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.09)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_22px_48px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/82 dark:shadow-[0_20px_44px_rgba(2,6,23,0.5)] sm:p-7">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-slate-900 dark:text-slate-100 sm:text-5xl">Level Up</h1>
        <p className="mt-2 text-base font-medium text-slate-600 dark:text-slate-300">{getTodayLabel()}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/daily-goals" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">Daily Goals</Link>
          <Link to="/monthly-goals" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">Monthly Goals</Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="h-full rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/82 dark:shadow-[0_12px_26px_rgba(2,6,23,0.4)]">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Streak</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">{activeStreak}</p>
        </article>
        <article className="h-full rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/82 dark:shadow-[0_12px_26px_rgba(2,6,23,0.4)]">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Best Streak</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">{bestStreak}</p>
        </article>
        <article className="h-full rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/82 dark:shadow-[0_12px_26px_rgba(2,6,23,0.4)]">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Perfect Days</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">{perfectDays}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/84 dark:shadow-[0_14px_30px_rgba(2,6,23,0.45)] sm:p-7 lg:col-span-5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Progress Ring</p>
          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
              <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                <circle cx="110" cy="110" r={progressRadius} stroke="rgba(148,163,184,0.22)" strokeWidth="16" fill="none" />
                <circle
                  cx="110"
                  cy="110"
                  r={progressRadius}
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  className="stroke-sky-500 transition-all duration-500 dark:stroke-sky-400"
                  style={{ strokeDasharray: progressCircumference, strokeDashoffset: progressOffset }}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-slate-100">{completionPercent}%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Today</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/84 dark:shadow-[0_14px_30px_rgba(2,6,23,0.45)] sm:p-7 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today&apos;s Progress</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-900 dark:text-slate-100">{completedHabitsToday}/{dailyGoals.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Completed daily goals</p>
            </div>
            <Link to="/daily-goals" className="text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200">Manage</Link>
          </div>

          <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500" style={{ width: `${completionPercent}%` }} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="h-full rounded-[20px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Monthly</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-900 dark:text-slate-100">{monthlyDone}/{monthlyGoals.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{monthlyProgress}%</p>
            </div>
            <div className="h-full rounded-[20px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Yearly</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-900 dark:text-slate-100">{yearlyDone}/{yearlyGoals.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{yearlyProgress}%</p>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Upcoming Tasks</p>
            {upcomingTasks.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No upcoming tasks.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <span className="truncate text-slate-800 dark:text-slate-200">{task.title}</span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{task.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="h-full rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/84 dark:shadow-[0_14px_30px_rgba(2,6,23,0.45)] sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Daily Goals</h2>
            <Link to="/daily-goals" className="text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200">View all</Link>
          </div>
          {dailyPreview.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No daily goals yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {dailyPreview.map((goal) => {
                const doneToday = goal.completedDates.includes(todayKey())
                return (
                  <div key={goal.id} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{goal.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{goal.category}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${doneToday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {doneToday ? 'Done' : 'Pending'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </article>

        <article className="h-full rounded-[24px] border border-slate-200/85 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/84 dark:shadow-[0_14px_30px_rgba(2,6,23,0.45)] sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Goals</h2>
            <Link to="/monthly-goals" className="text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200">View all</Link>
          </div>
          {monthlyPreview.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No monthly goals yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {monthlyPreview.map((goal) => (
                <div key={goal.id} className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{goal.title}</p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{goal.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-600" style={{ width: `${Math.min(100, Math.max(0, goal.progress || 0))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
