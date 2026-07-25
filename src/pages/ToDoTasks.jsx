import { useMemo, useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
import { createId } from '../services/storage'
import { scheduleReminder } from '../services/notifications'
import { isPastDate, todayKey } from '../utils/date'

export function ToDoTasks({ tasks, setTasks, showToast }) {
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [form, setForm] = useState({ title: '', description: '', date: todayKey(), reminderTime: '', priority: 'Medium', color: 'amber' })
  const [editingId, setEditingId] = useState(null)

  const visibleTasks = useMemo(() => tasks.filter((task) => task.date === selectedDate), [selectedDate, tasks])

  const addTask = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const nextTask = { id: createId('task'), title: form.title.trim(), description: form.description.trim(), date: form.date, reminderTime: form.reminderTime, priority: form.priority, color: form.color, completed: false }
    setTasks((current) => [...current, nextTask])
    if (nextTask.reminderTime) {
      scheduleReminder(`Reminder for ${nextTask.title} on ${nextTask.date} at ${nextTask.reminderTime}`, 'task')
    }
    setForm({ title: '', description: '', date: selectedDate, reminderTime: '', priority: 'Medium', color: 'amber' })
    showToast('Task saved')
  }

  const saveEdit = (taskId) => {
    if (!form.title.trim()) return
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, title: form.title.trim(), description: form.description.trim(), date: form.date, reminderTime: form.reminderTime, priority: form.priority, color: form.color } : task)))
    setEditingId(null)
    setForm({ title: '', description: '', date: selectedDate, reminderTime: '', priority: 'Medium', color: 'amber' })
    showToast('Task updated')
  }

  const toggleTask = (taskId) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    showToast('Task removed')
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setForm({ title: task.title, description: task.description, date: task.date, reminderTime: task.reminderTime, priority: task.priority, color: task.color })
  }

  const clearCompleted = () => {
    setTasks((current) => current.filter((task) => !(task.completed && isPastDate(task.date))))
    showToast('Old completed tasks cleared')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">To-Do Tasks</p>
        <h2 className="text-2xl font-semibold text-white">Plan any day without affecting daily goals</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[todayKey(), new Date(Date.now() + 86400000).toISOString().slice(0, 10), new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)].map((date) => (
            <button key={date} type="button" onClick={() => setSelectedDate(date)} className={`rounded-full px-3 py-2 text-sm ${selectedDate === date ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{date}</button>
          ))}
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-full border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white" />
        </div>
        <form onSubmit={addTask} className="mt-4 space-y-3">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Task title" />
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Task description" />
          <div className="grid gap-3 md:grid-cols-3">
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" />
            <input type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" />
            <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white">
              <option value="amber">Amber</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="sky">Sky</option>
            </select>
            <Button type="submit">Add task</Button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Tasks for {selectedDate}</p>
        <Button variant="secondary" type="button" onClick={clearCompleted}>Clear past completed</Button>
      </div>

      {visibleTasks.length === 0 ? (
        <EmptyState title="No tasks for this day" description="Create a plan for this date and keep it separate from habits." />
      ) : (
        <div className="grid gap-3">
          {visibleTasks.map((task) => {
            const isEditing = editingId === task.id
            return (
              <div key={task.id} className={`rounded-3xl border border-white/10 bg-slate-900/70 p-4 ${task.completed ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-950" />
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                          <div className="grid gap-2 md:grid-cols-2">
                            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                            <input type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={`text-lg font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{task.description}</p>
                          <p className="mt-2 text-sm text-slate-500">{task.priority} • {task.reminderTime || 'No reminder'}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <p>{task.priority}</p>
                    <p className="mt-1 text-white">{task.date}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="secondary" type="button" onClick={() => saveEdit(task.id)}>Save</Button>
                      <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', date: selectedDate, reminderTime: '', priority: 'Medium', color: 'amber' }) }}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" type="button" onClick={() => startEdit(task)}>Edit</Button>
                      <Button variant="ghost" type="button" onClick={() => deleteTask(task.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
