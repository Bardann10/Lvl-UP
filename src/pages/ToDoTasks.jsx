import { useMemo, useState } from 'react'
import { Button } from '../shared/ui/Button'
import { EmptyState } from '../shared/ui/EmptyState'
import { PageHeader } from '../shared/ui/PageHeader'
import { PlannerInput, PlannerSelect, PlannerTextarea } from '../shared/ui/PlannerField'
import { createId } from '../services/storage'
import { scheduleReminder } from '../services/notifications'
import { isPastDate, todayKey } from '../utils/date'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function ToDoTasks({ tasks, setTasks, showToast, compact = false }) {
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: todayKey(),
    reminderTime: '',
    priority: 'Medium',
    color: 'amber',
  })
  const [editingId, setEditingId] = useState(null)
  const [dateGenerationTimestamp] = useState(() => Date.now())

  const visibleTasks = useMemo(() => tasks.filter((task) => task.date === selectedDate), [selectedDate, tasks])

  const quickDateOptions = useMemo(
    () => [
      todayKey(),
      new Date(dateGenerationTimestamp + MS_PER_DAY).toISOString().slice(0, 10),
      new Date(dateGenerationTimestamp + 2 * MS_PER_DAY).toISOString().slice(0, 10),
    ],
    [dateGenerationTimestamp],
  )

  const addTask = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const nextTask = {
      id: createId('task'),
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      reminderTime: form.reminderTime,
      priority: form.priority,
      color: form.color,
      completed: false,
    }
    setTasks((current) => [...current, nextTask])
    if (nextTask.reminderTime) {
      scheduleReminder(`Reminder for ${nextTask.title} on ${nextTask.date} at ${nextTask.reminderTime}`, 'task')
    }
    setForm({ title: '', description: '', date: selectedDate, reminderTime: '', priority: 'Medium', color: 'amber' })
    showToast('Task saved')
  }

  const saveEdit = (taskId) => {
    if (!form.title.trim()) return
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: form.title.trim(),
              description: form.description.trim(),
              date: form.date,
              reminderTime: form.reminderTime,
              priority: form.priority,
              color: form.color,
            }
          : task,
      ),
    )
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
    setForm({
      title: task.title,
      description: task.description,
      date: task.date,
      reminderTime: task.reminderTime,
      priority: task.priority,
      color: task.color,
    })
  }

  const clearCompleted = () => {
    setTasks((current) => current.filter((task) => !(task.completed && isPastDate(task.date))))
    showToast('Old completed tasks cleared')
  }

  return (
    <div className={compact ? 'app-panel-soft space-y-4 p-4 sm:p-5' : 'page-shell'}>
      {!compact ? (
        <>
          <PageHeader
            eyebrow="To-Do Tasks"
            title="Plan each day with clarity"
            subtitle="Organize one-off tasks separately from your recurring habits in the same calm workspace."
          />
          <div className="app-panel p-5 sm:p-6">
            <div className="flex flex-wrap gap-3">
              {quickDateOptions.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                    selectedDate === date
                      ? 'app-chip app-chip-active'
                      : 'app-chip hover:-translate-y-0.5 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {date}
                </button>
              ))}
              <PlannerInput
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full sm:max-w-[13rem]"
              />
            </div>
            <form onSubmit={addTask} className="mt-5 space-y-3">
              <PlannerInput
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full"
                size="lg"
                placeholder="Task title"
              />
              <PlannerTextarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-28 w-full"
                placeholder="Task description"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <PlannerInput type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
                <PlannerInput
                  type="time"
                  value={form.reminderTime}
                  onChange={(event) => setForm({ ...form, reminderTime: event.target.value })}
                />
                <PlannerSelect value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </PlannerSelect>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <PlannerSelect
                  value={form.color}
                  onChange={(event) => setForm({ ...form, color: event.target.value })}
                  className="sm:max-w-[12rem]"
                >
                  <option value="amber">Amber</option>
                  <option value="emerald">Emerald</option>
                  <option value="violet">Violet</option>
                  <option value="sky">Sky</option>
                </PlannerSelect>
                <Button type="submit" className="sm:min-w-[8rem]">
                  Add task
                </Button>
              </div>
            </form>
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Schedule</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Tasks for {selectedDate}</p>
        </div>
        <Button variant="secondary" type="button" onClick={clearCompleted}>
          Clear past completed
        </Button>
      </div>

      {visibleTasks.length === 0 ? (
        <EmptyState title="No tasks for this day" description="Create a focused plan for this date and keep it separate from your daily habits." />
      ) : (
        <div className="grid gap-3">
          {visibleTasks.map((task) => {
            const isEditing = editingId === task.id
            return (
              <div key={task.id} className={`app-list-item p-4 sm:p-5 ${task.completed ? 'opacity-75' : ''}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 h-5 w-5 rounded border-[var(--color-border)] bg-transparent"
                    />
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="space-y-2.5">
                          <PlannerInput
                            value={form.title}
                            onChange={(event) => setForm({ ...form, title: event.target.value })}
                            className="w-full"
                            size="sm"
                          />
                          <PlannerTextarea
                            value={form.description}
                            onChange={(event) => setForm({ ...form, description: event.target.value })}
                            className="min-h-20 w-full"
                            size="sm"
                          />
                          <div className="grid gap-2 md:grid-cols-2">
                            <PlannerInput
                              type="date"
                              value={form.date}
                              onChange={(event) => setForm({ ...form, date: event.target.value })}
                              size="sm"
                            />
                            <PlannerInput
                              type="time"
                              value={form.reminderTime}
                              onChange={(event) => setForm({ ...form, reminderTime: event.target.value })}
                              size="sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-xl font-semibold tracking-[-0.03em] ${
                              task.completed ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">{task.description}</p>
                          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                            {task.priority} • {task.reminderTime || 'No reminder'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className="app-chip px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
                      {task.priority}
                    </span>
                    <p className="text-sm text-[var(--color-text-tertiary)]">{task.date}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="secondary" type="button" onClick={() => saveEdit(task.id)}>
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          setForm({
                            title: '',
                            description: '',
                            date: selectedDate,
                            reminderTime: '',
                            priority: 'Medium',
                            color: 'amber',
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" type="button" onClick={() => startEdit(task)}>
                        Edit
                      </Button>
                      <Button variant="ghost" type="button" onClick={() => deleteTask(task.id)}>
                        Delete
                      </Button>
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
