import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PlannerInput } from '../shared/ui/PlannerField'
import { createId } from '../services/storage'

export function Today({ tasks, setTasks, showToast }) {
  const [form, setForm] = useState('')

  const addTask = (event) => {
    event.preventDefault()
    if (!form.trim()) return
    setTasks((current) => [...current, { id: createId('task'), title: form.trim(), done: false }])
    setForm('')
    showToast('Task added')
  }

  const toggleTask = (taskId) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)))
  }

  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    showToast('Task removed')
  }

  return (
    <div className="page-shell">
      <div className="app-panel p-5 sm:p-6">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Today&apos;s Tasks</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">A lightweight checklist for today only</h2>
        </div>
        <form onSubmit={addTask} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <PlannerInput value={form} onChange={(event) => setForm(event.target.value)} className="flex-1" placeholder="Add task for today" />
          <Button type="submit">Add task</Button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks today" description="Capture what matters for today without affecting your long-term stats." />
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <div key={task.id} className="app-list-item flex items-center justify-between gap-3 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-5 w-5 rounded border-[var(--color-border)] bg-transparent" />
                <p className={`text-xl font-semibold tracking-[-0.03em] ${task.done ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'}`}>{task.title}</p>
              </div>
              <Button variant="ghost" type="button" onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
