import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'

export function Search({ dailyGoals, tasks, monthlyGoals, yearlyGoals }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const term = query.toLowerCase()
    const dailyMatches = dailyGoals.filter((goal) => `${goal.title} ${goal.category} ${goal.notes}`.toLowerCase().includes(term))
    const taskMatches = tasks.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(term))
    const monthlyMatches = monthlyGoals.filter((goal) => `${goal.title} ${goal.notes}`.toLowerCase().includes(term))
    const yearlyMatches = yearlyGoals.filter((goal) => `${goal.title} ${goal.category} ${goal.notes}`.toLowerCase().includes(term))

    return { dailyMatches, taskMatches, monthlyMatches, yearlyMatches }
  }, [dailyGoals, tasks, monthlyGoals, yearlyGoals, query])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Search"
        title="Find habits and goals fast"
        description="Search across daily goals, tasks, and longer-term plans in one focused view."
      />

      <div className="ui-card p-5">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Search goals, tasks, notes, and plans" />
      </div>

      <div className="grid gap-4">
        <div className="ui-card p-4">
          <p className="text-sm text-slate-400">Daily goals</p>
          {results.dailyMatches.length === 0 ? <p className="mt-2 text-slate-500">No daily goals match</p> : results.dailyMatches.map((goal) => <p key={goal.id} className="mt-2 text-white">• {goal.title}</p>)}
        </div>
        <div className="ui-card p-4">
          <p className="text-sm text-slate-400">To-do tasks</p>
          {results.taskMatches.length === 0 ? <p className="mt-2 text-slate-500">No tasks match</p> : results.taskMatches.map((task) => <p key={task.id} className="mt-2 text-white">• {task.title}</p>)}
        </div>
        <div className="ui-card p-4">
          <p className="text-sm text-slate-400">Monthly goals</p>
          {results.monthlyMatches.length === 0 ? <p className="mt-2 text-slate-500">No monthly goals match</p> : results.monthlyMatches.map((goal) => <p key={goal.id} className="mt-2 text-white">• {goal.title}</p>)}
        </div>
        <div className="ui-card p-4">
          <p className="text-sm text-slate-400">Yearly goals</p>
          {results.yearlyMatches.length === 0 ? <p className="mt-2 text-slate-500">No yearly goals match</p> : results.yearlyMatches.map((goal) => <p key={goal.id} className="mt-2 text-white">• {goal.title}</p>)}
        </div>
      </div>
    </div>
  )
}
