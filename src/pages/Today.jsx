import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
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
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Today&apos;s Tasks</p>
            <h2 className="text-2xl font-semibold text-white">A lightweight checklist for today only</h2>
          </div>
        </div>
        <form onSubmit={addTask} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={form} onChange={(event) => setForm(event.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Add task for today" />
          <Button type="submit">Add task</Button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks today" description="Capture things that matter for this day without affecting your long-term stats." />
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-5 w-5 rounded border-slate-600 bg-slate-950" />
                <p className={`text-lg ${task.done ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</p>
              </div>
              <Button variant="ghost" type="button" onClick={() => deleteTask(task.id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
