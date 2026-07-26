import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PageHeader } from '../shared/ui/PageHeader'
import { createId } from '../services/storage'

export function YearlyGoals({ yearlyGoals, setYearlyGoals, showToast }) {
  const [form, setForm] = useState({ title: '', category: '' })
  const [editingId, setEditingId] = useState(null)

  const addGoal = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setYearlyGoals((current) => [...current, { id: createId('yearly'), title: form.title.trim(), category: form.category.trim() || 'Growth', progress: 0, completed: false }])
    setForm({ title: '', category: '' })
    showToast('Yearly goal added')
  }

  const saveEdit = (goalId) => {
    const payload = form.title.trim()
    if (!payload) return
    setYearlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, title: payload, category: form.category.trim() || 'Growth' } : goal)))
    setEditingId(null)
    setForm({ title: '', category: '' })
    showToast('Goal updated')
  }

  const toggleGoal = (goalId) => {
    setYearlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed, progress: goal.completed ? Math.max(0, goal.progress - 10) : Math.min(100, goal.progress + 10) } : goal)))
  }

  const updateProgress = (goalId, value) => {
    setYearlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, Number(value))) } : goal)))
  }

  const deleteGoal = (goalId) => {
    setYearlyGoals((current) => current.filter((goal) => goal.id !== goalId))
    showToast('Goal removed')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Yearly Goals"
        title="Long-term categories and progress"
        action={
          <form onSubmit={addGoal} className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="New yearly goal" />
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Category" />
            <Button type="submit">Add goal</Button>
          </form>
        }
      />

      {yearlyGoals.length === 0 ? (
        <EmptyState title="No yearly goals yet" description="Map out the big milestones across your life and work." />
      ) : (
        <div className="grid gap-4">
          {yearlyGoals.map((goal) => (
            <div key={goal.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <div className="flex flex-col gap-2 md:flex-row">
                      <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                      <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                    </div>
                  ) : (
                    <>
                      <p className={`text-lg font-semibold ${goal.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>{goal.title}</p>
                      <p className="text-sm text-slate-400">{goal.category}</p>
                    </>
                  )}
                </div>
                <Button variant="secondary" type="button" onClick={() => toggleGoal(goal.id)}>{goal.completed ? 'Undo' : 'Mark done'}</Button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-violet-500" style={{ width: `${goal.progress}%` }} />
                </div>
                <input type="range" min="0" max="100" value={goal.progress} onChange={(event) => updateProgress(goal.id, event.target.value)} className="w-28 accent-violet-500" />
              </div>
              <p className="mt-2 text-sm text-slate-400">Progress {goal.progress}%</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {editingId === goal.id ? (
                  <>
                    <Button variant="secondary" type="button" onClick={() => saveEdit(goal.id)}>Save</Button>
                    <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm({ title: '', category: '' }) }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" type="button" onClick={() => { setEditingId(goal.id); setForm({ title: goal.title, category: goal.category }) }}>Edit</Button>
                    <Button variant="ghost" type="button" onClick={() => deleteGoal(goal.id)}>Delete</Button>
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
