import { useMemo, useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { PlannerInput } from '../shared/ui/PlannerField'

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

  const groups = [
    ['Daily goals', results.dailyMatches],
    ['To-do tasks', results.taskMatches],
    ['Monthly goals', results.monthlyMatches],
    ['Yearly goals', results.yearlyMatches],
  ]

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Search"
        title="Find habits and goals fast"
        subtitle="Search every planner surface from one refined command center."
        action={
          <PlannerInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full lg:min-w-[22rem]"
            size="lg"
            placeholder="Search goals, tasks, notes, and plans"
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(([label, items]) => (
          <div key={label} className="app-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{label}</p>
              <span className="app-chip px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-[var(--color-text-tertiary)]">No matches yet.</p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <div key={item.id} className="app-list-item px-4 py-3.5">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
