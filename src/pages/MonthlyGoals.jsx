import { useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
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
    setMonthlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed, progress: goal.completed ? Math.max(0, goal.progress - 10) : Math.min(100, goal.progress + 10) } : goal)))
  }

  const updateProgress = (goalId, value) => {
    setMonthlyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, Number(value))) } : goal)))
  }

  const deleteGoal = (goalId) => {
    setMonthlyGoals((current) => current.filter((goal) => goal.id !== goalId))
    showToast('Goal removed')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Monthly Goals</p>
        <h2 className="text-2xl font-semibold text-white">Track progress with momentum</h2>
        <form onSubmit={addGoal} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={form} onChange={(event) => setForm(event.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Add monthly goal" />
          <Button type="submit">Save goal</Button>
        </form>
      </div>

      {monthlyGoals.length === 0 ? (
        <EmptyState title="No monthly goals yet" description="Set a few milestones to keep your month intentional." />
      ) : (
        <div className="grid gap-4">
          {monthlyGoals.map((goal) => (
            <div key={goal.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <input value={form} onChange={(event) => setForm(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                  ) : (
                    <p className={`text-lg font-semibold ${goal.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>{goal.title}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-400">Target {goal.target}</p>
                </div>
                <Button variant="secondary" type="button" onClick={() => toggleGoal(goal.id)}>{goal.completed ? 'Undo' : 'Mark done'}</Button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(100, goal.progress)}%` }} />
                </div>
                <input type="range" min="0" max="100" value={goal.progress} onChange={(event) => updateProgress(goal.id, event.target.value)} className="w-28 accent-sky-500" />
              </div>
              <p className="mt-2 text-sm text-slate-400">Progress {goal.progress}%</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {editingId === goal.id ? (
                  <>
                    <Button variant="secondary" type="button" onClick={() => saveEdit(goal.id)}>Save</Button>
                    <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm('') }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" type="button" onClick={() => { setEditingId(goal.id); setForm(goal.title) }}>Edit</Button>
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
