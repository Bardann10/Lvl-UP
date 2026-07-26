import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PageHeader } from '../shared/ui/PageHeader'
import { PlannerInput } from '../shared/ui/PlannerField'
import { createId } from '../services/storage'

export function MonthlyGoals({ monthlyGoals, setMonthlyGoals, showToast }) {
  const [form, setForm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const addGoal = (event) => {
    event.preventDefault()
    if (!form.trim()) return
    setMonthlyGoals((current) => [...current, { id: createId('monthly'), title: form.trim(), target: 100, progress: 0, completed: false }])
    setForm('')
    showToast('Monthly goal added')
  }

  const saveEdit = (goalId) => {
    const payload = form.trim()
    if (!payload) return
    setMonthlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, title: payload } : goal)))
    setEditingId(null)
    setForm('')
    showToast('Goal updated')
  }

  const toggleGoal = (goalId) => {
    setMonthlyGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              completed: !goal.completed,
              progress: goal.completed ? Math.max(0, goal.progress - 10) : Math.min(100, goal.progress + 10),
            }
          : goal,
      ),
    )
  }

  const updateProgress = (goalId, value) => {
    setMonthlyGoals((current) =>
      current.map((goal) => (goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, Number(value))) } : goal)),
    )
  }

  const deleteGoal = (goalId) => {
    setMonthlyGoals((current) => current.filter((goal) => goal.id !== goalId))
    showToast('Goal removed')
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Monthly Goals"
        title="Track progress with momentum"
        subtitle="Keep the month intentional with clear milestones, smooth controls, and a consistent visual rhythm."
        action={
          <form onSubmit={addGoal} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <PlannerInput value={form} onChange={(event) => setForm(event.target.value)} placeholder="Add monthly goal" />
            <Button type="submit" className="sm:min-w-[8rem]">
              Save goal
            </Button>
          </form>
        }
      />

      {monthlyGoals.length === 0 ? (
        <EmptyState title="No monthly goals yet" description="Set a few milestones to keep your month focused and energizing." />
      ) : (
        <div className="grid gap-4">
          {monthlyGoals.map((goal) => (
            <div key={goal.id} className="app-list-item p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <PlannerInput value={form} onChange={(event) => setForm(event.target.value)} className="w-full" />
                  ) : (
                    <p
                      className={`text-2xl font-semibold tracking-[-0.03em] ${
                        goal.completed ? 'text-[var(--color-success)] line-through' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      {goal.title}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">Target {goal.target}</p>
                </div>
                <Button variant="secondary" type="button" onClick={() => toggleGoal(goal.id)}>
                  {goal.completed ? 'Undo' : 'Mark done'}
                </Button>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="app-stat-bar h-3 flex-1">
                  <span className="bg-[var(--gradient-accent)]" style={{ width: `${Math.min(100, goal.progress)}%` }} />
                </div>
                <input type="range" min="0" max="100" value={goal.progress} onChange={(event) => updateProgress(goal.id, event.target.value)} className="w-28" />
              </div>
              <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">Progress {goal.progress}%</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {editingId === goal.id ? (
                  <>
                    <Button variant="secondary" type="button" onClick={() => saveEdit(goal.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setForm('')
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setEditingId(goal.id)
                        setForm(goal.title)
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => deleteGoal(goal.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
