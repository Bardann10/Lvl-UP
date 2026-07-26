import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PageHeader } from '../shared/ui/PageHeader'
import { PlannerInput, PlannerSelect, PlannerTextarea } from '../shared/ui/PlannerField'
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
        return {
          ...goal,
          completedDates,
          streak: completedDates.includes(todayKey()) ? (goal.streak || 0) + 1 : Math.max(0, (goal.streak || 0) - 1),
        }
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
    setDailyGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              title: payload,
              category: form.category.trim() || 'General',
              notes: form.notes.trim(),
              reminderTime: form.reminderTime,
              icon: form.icon || 'self_improvement',
              color: form.color || 'sky',
            }
          : goal,
      ),
    )
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
    setForm({
      title: goal.title,
      category: goal.category,
      notes: goal.notes || '',
      reminderTime: goal.reminderTime || '',
      icon: goal.icon || 'self_improvement',
      color: goal.color || 'sky',
    })
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
    <div className="page-shell">
      <PageHeader
        eyebrow="Daily Goals"
        title="A calm place for habits and plans"
        subtitle="Switch between habits and daily tasks inside one mobile-first workspace with spacious cards and gentle motion."
        action={<Button type="button" variant="secondary">{dailyGoals.length} goals</Button>}
      />
      <div className="app-panel p-5 sm:p-6">
        <div className="app-inset flex p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold ${
              activeTab === 'tasks'
                ? 'bg-[var(--gradient-accent)] text-slate-950 shadow-[var(--shadow-soft)]'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            To-Do Tasks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold ${
              activeTab === 'goals'
                ? 'bg-[var(--gradient-accent)] text-slate-950 shadow-[var(--shadow-soft)]'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            Daily Goals
          </button>
        </div>

        {activeTab === 'tasks' ? (
          <div className="mt-5">
            <ToDoTasks tasks={tasks || []} setTasks={setTasks} showToast={showToast} compact />
          </div>
        ) : (
          <form onSubmit={addGoal} className="mt-5 space-y-3">
            <PlannerInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full" size="lg" placeholder="New goal" />
            <div className="grid gap-3 md:grid-cols-2">
              <PlannerInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} size="lg" placeholder="Category" />
              <PlannerInput value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} size="lg" placeholder="Icon name" />
            </div>
            <PlannerTextarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-28 w-full" size="lg" placeholder="Notes" />
            <div className="grid gap-3 md:grid-cols-2">
              <PlannerInput type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} size="lg" />
              <PlannerSelect value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} size="lg">
                <option value="sky">Sky</option>
                <option value="emerald">Emerald</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
              </PlannerSelect>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add goal</Button>
            </div>
          </form>
        )}
      </div>

      {activeTab === 'goals' &&
        (dailyGoals.length === 0 ? (
          <EmptyState title="No daily goals yet" description="Create your first recurring habit and keep your streak alive with one polished flow." />
        ) : (
          <div className="grid gap-4">
            {dailyGoals.map((goal, index) => {
              const doneToday = goal.completedDates.includes(todayKey())
              const isEditing = editingId === goal.id
              return (
                <div
                  key={goal.id}
                  draggable
                  onDragStart={() => setDraggedId(goal.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="app-list-item p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={doneToday} onChange={() => toggleGoal(goal.id)} className="mt-1 h-5 w-5 rounded border-[var(--color-border)] bg-transparent" />
                        {isEditing ? (
                          <div className="flex flex-1 flex-col gap-2 md:flex-row">
                            <PlannerInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="flex-1" size="sm" />
                            <PlannerInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} size="sm" />
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <p className={`text-2xl font-semibold tracking-[-0.03em] ${doneToday ? 'text-[var(--color-success)] line-through' : 'text-[var(--color-text-primary)]'}`}>{goal.title}</p>
                            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">{goal.category}</p>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="mt-4 space-y-2.5">
                          <PlannerTextarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-24 w-full" size="sm" />
                          <div className="grid gap-2 md:grid-cols-2">
                            <PlannerInput type="time" value={form.reminderTime} onChange={(event) => setForm({ ...form, reminderTime: event.target.value })} size="sm" />
                            <PlannerInput value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} size="sm" />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">
                          {goal.notes ? <p>{goal.notes}</p> : null}
                          {goal.reminderTime ? <p className="mt-1">Reminder {goal.reminderTime}</p> : null}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-end">
                      <span className="app-chip px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">Streak</span>
                      <p className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">{goal.streak || 0}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="secondary" type="button" onClick={() => saveEdit(goal.id)}>
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => {
                            setEditingId(null)
                            setForm(EMPTY_FORM)
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" type="button" onClick={() => moveGoal(index, -1)}>
                          ↑
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => moveGoal(index, 1)}>
                          ↓
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => startEdit(goal)}>
                          Edit
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => deleteGoal(goal.id)}>
                          Delete
                        </Button>
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
