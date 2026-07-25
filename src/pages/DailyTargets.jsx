import { useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
import { createId } from '../services/storage'
import { scheduleReminder } from '../services/notifications'
import { todayKey } from '../utils/date'
import { ToDoTasks } from './ToDoTasks'

const EMPTY_FORM = {
  title: '',
  category: '',
  notes: '',
  reminderTime: '',
  icon: 'self_improvement',
  color: 'sky',
}

export function DailyTargets({ dailyGoals, tasks, setDailyGoals, setTasks, showToast }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks')

  const toggleGoal = (goalId) => {
    setDailyGoals((current) =>
      current.map((goal) => {
        if (goal.id !== goalId) return goal
        const completedDates = goal.completedDates.includes(todayKey())
          ? goal.completedDates.filter((date) => date !== todayKey())
          : [...goal.completedDates, todayKey()]
        return { ...goal, completedDates, streak: completedDates.includes(todayKey()) ? (goal.streak || 0) + 1 : Math.max(0, (goal.streak || 0) - 1) }
      }),
    )
    showToast('Goal updated')
  }

  const addGoal = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const nextGoal = {
      id: createId('goal'),
      title: form.title.trim(),
      category: form.category.trim() || 'General',
      notes: form.notes.trim(),
      reminderTime: form.reminderTime,
      icon: form.icon || 'self_improvement',
      color: form.color || 'sky',
      completedDates: [],
      streak: 0,
    }
    setDailyGoals((current) => [...current, nextGoal])
    if (nextGoal.reminderTime) {
      scheduleReminder(`Reminder for ${nextGoal.title} at ${nextGoal.reminderTime}`, 'goal')
    }
    setForm(EMPTY_FORM)
    showToast('Daily goal added')
  }

  const saveEdit = (goalId) => {
    const payload = form.title.trim()
    if (!payload) return
    setDailyGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, title: payload, category: form.category.trim() || 'General', notes: form.notes.trim(), reminderTime: form.reminderTime, icon: form.icon || 'self_improvement', color: form.color || 'sky' } : goal)))
    setEditingId(null)
    setForm(EMPTY_FORM)
    showToast('Goal updated')
  }

  const deleteGoal = (goalId) => {
    setDailyGoals((current) => current.filter((goal) => goal.id !== goalId))
    showToast('Goal removed')
  }

  const moveGoal = (index, direction) => {
    setDailyGoals((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setForm({ title: goal.title, category: goal.category, notes: goal.notes || '', reminderTime: goal.reminderTime || '', icon: goal.icon || 'self_improvement', color: goal.color || 'sky' })
  }

  const handleDrop = (targetIndex) => {
    if (draggedId === null) return
    setDailyGoals((current) => {
      const next = [...current]
      const fromIndex = next.findIndex((goal) => goal.id === draggedId)
      if (fromIndex < 0 || fromIndex === targetIndex) return current
      const [moved] = next.splice(fromIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
    setDraggedId(null)
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Daily Goals</p>
            <h2 className="text-2xl font-semibold text-white">A calm place for habits and plans</h2>
          </div>
          <Button type="button" variant="secondary">{dailyGoals.length} goals</Button>
        </div>

        <div className="mt-5 flex rounded-full border border-white/10 bg-slate-950/70 p-1.5">
          <button type="button" onClick={() => setActiveTab('tasks')} className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-sky-500 text-slate-950' : 'text-slate-300'}`}>
            To-Do Tasks
          </button>
          <button type="button" onClick={() => setActiveTab('goals')} className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${activeTab === 'goals' ? 'bg-sky-500 text-slate-950' : 'text-slate-300'}`}>
            Daily Goals
          </button>
        </div>

        {activeTab === 'tasks' ? (
          <div className="mt-5">
            <ToDoTasks tasks={tasks || []} setTasks={setTasks} showToast={showToast} compact />
          </div>
        ) : (
          <form onSubmit={addGoal} className="mt-5 space-y-3">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="New goal" />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Category" />
            <input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Icon name" />
          </div>
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Notes" />
          <div className="grid gap-3 md:grid-cols-2">
            <input type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
            <select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
              <option value="sky">Sky</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="amber">Amber</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add goal</Button>
          </div>
        </form>
        )}
      </div>

      {activeTab === 'goals' && (dailyGoals.length === 0 ? (
        <EmptyState title="No daily goals yet" description="Create your first recurring habit and keep your streak alive." />
      ) : (
        <div className="grid gap-4">
          {dailyGoals.map((goal, index) => {
            const doneToday = goal.completedDates.includes(todayKey())
            const isEditing = editingId === goal.id
            return (
              <div key={goal.id} draggable onDragStart={() => setDraggedId(goal.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(index)} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={doneToday} onChange={() => toggleGoal(goal.id)} className="h-5 w-5 rounded border-slate-600 bg-slate-950" />
                      {isEditing ? (
                        <div className="flex flex-1 flex-col gap-2 md:flex-row">
                          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                          <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                        </div>
                      ) : (
                        <div>
                          <p className={`text-lg font-semibold ${doneToday ? 'text-emerald-400 line-through' : 'text-white'}`}>{goal.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{goal.category}</p>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-3 space-y-2">
                        <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                        <div className="grid gap-2 md:grid-cols-2">
                          <input type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                          <input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-slate-400">
                        {goal.notes ? <p>{goal.notes}</p> : null}
                        {goal.reminderTime ? <p className="mt-1">Reminder {goal.reminderTime}</p> : null}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <p>Streak</p>
                    <p className="text-lg font-semibold text-white">{goal.streak || 0}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="secondary" type="button" onClick={() => saveEdit(goal.id)}>Save</Button>
                      <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM) }}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" type="button" onClick={() => moveGoal(index, -1)}>↑</Button>
                      <Button variant="ghost" type="button" onClick={() => moveGoal(index, 1)}>↓</Button>
                      <Button variant="ghost" type="button" onClick={() => startEdit(goal)}>Edit</Button>
                      <Button variant="ghost" type="button" onClick={() => deleteGoal(goal.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
