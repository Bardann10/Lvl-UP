import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '../shared/ui/Card'
import { MonthCalendar } from '../shared/ui/MonthCalendar'
import { ProgressRing } from '../shared/ui/ProgressRing'
import { Achievements } from './Achievements'
import { todayKey, getTodayLabel } from '../utils/date'
import { ROUTES } from '../app/router'

export function Dashboard({ dailyGoals, tasks, monthlyGoals, yearlyGoals, achievements, setAchievements }) {
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
    <div className="page-shell">
      <div className="app-hero p-6 sm:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">Welcome back</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-[3.4rem]">
          Level up your daily momentum.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
          {getTodayLabel()} is your reset point. Keep the streak alive, stay focused, and move through your planner with the feel of a polished productivity studio.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={ROUTES.DAILY_GOALS} className="app-chip app-chip-active px-5 py-3 text-sm font-semibold">
            View Daily Goals
          </Link>
          <Link to={ROUTES.ACHIEVEMENTS} className="app-chip px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:text-[var(--color-text-primary)]">
            See achievements
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="app-panel p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Today&apos;s progress</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                {completedHabitsToday}/{dailyGoals.length} goals completed
              </p>
            </div>
            <Link to={ROUTES.DAILY_GOALS} className="text-sm font-semibold text-[var(--color-accent)]">
              Manage goals
            </Link>
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

        <div className="app-panel p-5 sm:p-6">
          <p className="text-sm text-[var(--color-text-muted)]">Quick navigation</p>
          <div className="mt-4 grid gap-3">
            {[
              ['Daily Goals', ROUTES.DAILY_GOALS, 'track_changes'],
              ['To-Do Tasks', ROUTES.TODO_TASKS, 'task_alt'],
              ['Achievements', ROUTES.ACHIEVEMENTS, 'workspace_premium'],
              ['Statistics', ROUTES.STATISTICS, 'bar_chart'],
            ].map(([label, to, icon]) => (
              <Link
                key={to}
                to={to}
                className="app-list-item flex items-center justify-between px-4 py-4 text-[var(--color-text-primary)] hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <span className="app-icon-badge h-10 w-10">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </span>
                  {label}
                </span>
                <span className="material-symbols-outlined text-[var(--color-text-muted)]">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="app-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-text-muted)]">Monthly calendar</p>
            <Link to={ROUTES.CALENDAR} className="text-sm font-semibold text-[var(--color-accent)]">
              Open calendar
            </Link>
          </div>
          <div className="mt-4">
            <MonthCalendar dailyGoals={dailyGoals} selectedDate={todayKey()} onSelectDate={() => {}} viewDate={viewDate} compact />
          </div>
        </div>
        <div className="app-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-text-muted)]">Upcoming to-do tasks</p>
            <Link to={ROUTES.TODO_TASKS} className="text-sm font-semibold text-[var(--color-accent)]">
              Open planner
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-[var(--color-text-tertiary)]">No upcoming tasks yet. Add one to stay ahead.</p>
          ) : (
            <div className="mt-4 space-y-2.5">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="app-list-item flex items-center justify-between gap-3 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{task.date} • {task.priority}</p>
                  </div>
                  <span className="app-chip px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
                    {task.reminderTime || 'Any time'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="app-panel p-5 sm:p-6">
          <p className="text-sm text-[var(--color-text-muted)]">Progress snapshot</p>
          <div className="mt-4 space-y-4">
            <div className="app-list-item px-4 py-4">
              <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Monthly progress</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{monthlyProgress}%</span>
              </div>
              <div className="app-stat-bar mt-3 h-2.5">
                <span className="bg-[var(--gradient-accent)]" style={{ width: `${monthlyProgress}%` }} />
              </div>
            </div>
            <div className="app-list-item px-4 py-4">
              <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Yearly progress</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{yearlyProgress}%</span>
              </div>
              <div className="app-stat-bar mt-3 h-2.5">
                <span className="bg-gradient-to-r from-violet-400 to-sky-400" style={{ width: `${yearlyProgress}%` }} />
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm text-[var(--color-text-muted)]">Quote of the day</p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">“{quote}”</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">Small wins compound into major momentum.</p>
        </div>

        <div className="min-w-0">
          <Achievements dailyGoals={dailyGoals} achievements={achievements} setAchievements={setAchievements} compact />
        </div>
      </div>
    </div>
  )
}
