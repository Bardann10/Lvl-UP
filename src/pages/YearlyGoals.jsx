import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PageHeader } from '../shared/ui/PageHeader'
import { PlannerInput } from '../shared/ui/PlannerField'
import { createId } from '../services/storage'

export function YearlyGoals({ yearlyGoals, setYearlyGoals, showToast }) {
  const [form, setForm] = useState({ title: '', category: '' })
  const [editingId, setEditingId] = useState(null)

  const addGoal = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setYearlyGoals((current) => [
      ...current,
      { id: createId('yearly'), title: form.title.trim(), category: form.category.trim() || 'Growth', progress: 0, completed: false },
    ])
    setForm({ title: '', category: '' })
    showToast('Yearly goal added')
  }

  const saveEdit = (goalId) => {
    const payload = form.title.trim()
    if (!payload) return
    setYearlyGoals((current) =>
      current.map((goal) => (goal.id === goalId ? { ...goal, title: payload, category: form.category.trim() || 'Growth' } : goal)),
    )
    setEditingId(null)
    setForm({ title: '', category: '' })
    showToast('Goal updated')
  }

  const toggleGoal = (goalId) => {
    setYearlyGoals((current) =>
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
    setYearlyGoals((current) =>
      current.map((goal) => (goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, Number(value))) } : goal)),
    )
  }

  const deleteGoal = (goalId) => {
    setYearlyGoals((current) => current.filter((goal) => goal.id !== goalId))
    showToast('Goal removed')
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Yearly Goals"
        title="Build the bigger arc"
        subtitle="Shape long-term ambition with polished cards, spacious controls, and always-visible progress."
        action={
          <form onSubmit={addGoal} className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
            <PlannerInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="New yearly goal" />
            <PlannerInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" />
            <Button type="submit">Add goal</Button>
          </form>
        }
      />

      {yearlyGoals.length === 0 ? (
        <EmptyState title="No yearly goals yet" description="Map out the major milestones that deserve your energy this year." />
      ) : (
        <div className="grid gap-4">
          {yearlyGoals.map((goal) => (
            <div key={goal.id} className="app-list-item p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <div className="flex flex-col gap-2 md:flex-row">
                      <PlannerInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="flex-1" />
                      <PlannerInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
                    </div>
                  ) : (
                    <>
                      <p
                        className={`text-2xl font-semibold tracking-[-0.03em] ${
                          goal.completed ? 'text-[var(--color-success)] line-through' : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        {goal.title}
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">{goal.category}</p>
                    </>
                  )}
                </div>
                <Button variant="secondary" type="button" onClick={() => toggleGoal(goal.id)}>
                  {goal.completed ? 'Undo' : 'Mark done'}
                </Button>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="app-stat-bar h-3 flex-1">
                  <span className="bg-gradient-to-r from-violet-400 to-sky-400" style={{ width: `${goal.progress}%` }} />
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
                        setForm({ title: '', category: '' })
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
                        setForm({ title: goal.title, category: goal.category })
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
