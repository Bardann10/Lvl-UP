import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
import { createId } from '../services/storage'
import { getTodayLabel } from '../utils/date'

const EMPTY_FORM = {
  title: '',
  note: '',
  dueDate: '',
  dueTime: '',
  priority: '',
}

export function ToDoTasks({ tasks, setTasks, showToast, compact = false }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showSheet, setShowSheet] = useState(false)
  const [lastAddedId, setLastAddedId] = useState(null)
  const [swipeOffsetById, setSwipeOffsetById] = useState({})
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const interactionRef = useRef({
    id: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
    dragging: false,
    swipeLocked: false,
  })
  const holdTimerRef = useRef(null)

  const totalCount = tasks.length
  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks])
  const remainingCount = useMemo(() => Math.max(0, totalCount - completedCount), [totalCount, completedCount])

  useEffect(() => {
    if (!lastAddedId) return
    const timeout = setTimeout(() => setLastAddedId(null), 350)
    return () => clearTimeout(timeout)
  }, [lastAddedId])

  useEffect(() => {
    if (tasks.length === 0) setShowSheet(true)
  }, [tasks.length])

  useEffect(() => {
    setSwipeOffsetById((current) => {
      const next = {}
      tasks.forEach((task) => {
        if (Object.prototype.hasOwnProperty.call(current, task.id)) {
          next[task.id] = current[task.id]
        }
      })
      return next
    })
  }, [tasks])

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const closeSheet = () => {
    setShowSheet(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const addTask = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const noteText = form.note.trim()
    const nextTask = {
      id: createId('task'),
      title: form.title.trim(),
      description: noteText,
      notes: noteText,
      date: form.dueDate || '',
      reminderTime: form.dueTime || '',
      dueDate: form.dueDate || '',
      dueTime: form.dueTime || '',
      priority: form.priority || '',
      color: 'amber',
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((current) => [...current, nextTask])
    setLastAddedId(nextTask.id)
    setForm(EMPTY_FORM)
    setShowSheet(false)
    showToast('Task saved')
  }

  const saveEdit = (taskId) => {
    if (!form.title.trim()) return
    const noteText = form.note.trim()
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: form.title.trim(),
              description: noteText,
              notes: noteText,
              date: form.dueDate || '',
              reminderTime: form.dueTime || '',
              dueDate: form.dueDate || '',
              dueTime: form.dueTime || '',
              priority: form.priority || '',
            }
          : task,
      ),
    )
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowSheet(false)
    showToast('Task updated')
  }

  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    setSwipeOffsetById((current) => {
      const next = { ...current }
      delete next[taskId]
      return next
    })
    showToast('Task removed')
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setShowSheet(true)
    setForm({
      title: task.title || '',
      note: task.notes || task.description || '',
      dueDate: task.dueDate || task.date || '',
      dueTime: task.dueTime || task.reminderTime || '',
      priority: task.priority || '',
    })
  }

  const reorderTasks = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return

    setTasks((current) => {
      const next = [...current]
      const fromIndex = next.findIndex((task) => task.id === sourceId)
      const toIndex = next.findIndex((task) => task.id === targetId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handleRowPointerDown = (event, taskId) => {
    if (event.button !== 0) return

    clearHoldTimer()
    interactionRef.current = {
      id: taskId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }

    holdTimerRef.current = setTimeout(() => {
      interactionRef.current.dragging = true
      setDraggingId(taskId)
      setDragOverId(taskId)
      setSwipeOffsetById((current) => ({ ...current, [taskId]: 0 }))
    }, 280)
  }

  const handleRowPointerMove = (event, taskId) => {
    const interaction = interactionRef.current
    if (interaction.id !== taskId || interaction.pointerId !== event.pointerId) return

    const deltaX = event.clientX - interaction.startX
    const deltaY = event.clientY - interaction.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > 6 || absY > 6) interaction.moved = true

    if (interaction.dragging) {
      event.preventDefault()
      const rowAtPoint = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-task-row-id]')
      const overId = rowAtPoint?.getAttribute('data-task-row-id')
      if (overId) setDragOverId(overId)
      return
    }

    if (!interaction.swipeLocked && absY > absX && absY > 10) {
      clearHoldTimer()
      return
    }

    if (absX > 8 && absX > absY) {
      clearHoldTimer()
      interaction.swipeLocked = true
      const offset = Math.max(-112, Math.min(88, deltaX))
      setSwipeOffsetById((current) => ({ ...current, [taskId]: offset }))
    }
  }

  const handleRowPointerUp = (event, task) => {
    const interaction = interactionRef.current
    if (interaction.id !== task.id || interaction.pointerId !== event.pointerId) return

    clearHoldTimer()
    const currentOffset = swipeOffsetById[task.id] || 0

    if (interaction.dragging) {
      if (dragOverId && dragOverId !== task.id) {
        reorderTasks(task.id, dragOverId)
      }
      setDraggingId(null)
      setDragOverId(null)
      setSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
    } else if (currentOffset <= -72) {
      setSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      deleteTask(task.id)
    } else if (currentOffset >= 68) {
      setSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      toggleTask(task.id)
    } else {
      setSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      if (!interaction.moved) startEdit(task)
    }

    interactionRef.current = {
      id: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }
  }

  const formatDue = (task) => {
    const dueDate = task.dueDate || task.date
    const dueTime = task.dueTime || task.reminderTime
    if (!dueDate && !dueTime) return ''
    if (dueDate && dueTime) return `${dueDate} ${dueTime}`
    return dueDate || dueTime || ''
  }

  void compact

  return (
    <div className="space-y-4 pb-24 lg:pb-6">
      <section className="rounded-[24px] border border-white/10 bg-slate-800/90 p-4 shadow-[0_18px_38px_rgba(2,6,23,0.42)] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Planner</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-50 sm:text-3xl">To-Do Tasks</h1>
            <p className="mt-1 text-sm text-slate-300">{getTodayLabel()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300">
            {completedCount} done · {remainingCount} remaining
          </div>
        </div>
      </section>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Capture one-time tasks here without affecting your daily goals or streaks."
          action={
            <Button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(EMPTY_FORM)
                setShowSheet(true)
              }}
            >
              Add your first task
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/95 shadow-[0_14px_28px_rgba(2,6,23,0.4)]">
          <ul className="divide-y divide-white/10">
            {tasks.map((task) => {
              const rowOffset = swipeOffsetById[task.id] || 0
              const isDragging = draggingId === task.id
              const isDragTarget = dragOverId === task.id && draggingId !== task.id
              const note = task.notes || task.description || ''
              const dueLabel = formatDue(task)

              return (
                <li key={task.id} className={`group relative ${isDragTarget ? 'bg-blue-500/10' : ''}`}>
                  <article
                    data-task-row-id={task.id}
                    onPointerDown={(event) => handleRowPointerDown(event, task.id)}
                    onPointerMove={(event) => handleRowPointerMove(event, task.id)}
                    onPointerUp={(event) => handleRowPointerUp(event, task)}
                    onPointerCancel={() => {
                      clearHoldTimer()
                      setDraggingId(null)
                      setDragOverId(null)
                      setSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
                    }}
                    style={{ transform: `translateX(${rowOffset}px)` }}
                    className={`relative flex cursor-grab select-none items-start gap-3 bg-slate-800/95 px-4 py-3 transition-[transform,box-shadow,background-color] duration-200 active:cursor-grabbing ${isDragging ? 'z-20 scale-[1.01] shadow-[0_18px_34px_rgba(2,6,23,0.55)]' : ''} ${task.completed ? 'bg-emerald-500/10' : ''} ${lastAddedId === task.id ? 'goal-card-enter' : ''}`}
                  >
                    <label className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center" onPointerDown={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="h-5 w-5 rounded-md border border-slate-500 bg-slate-900 transition-all duration-200 checked:scale-110 checked:border-indigo-400 checked:bg-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`truncate text-[15px] font-semibold ${task.completed ? 'text-emerald-300 line-through' : 'text-slate-50'}`}>{task.title}</p>
                          {note ? <p className="mt-0.5 truncate text-sm text-slate-300">{note}</p> : null}
                        </div>
                        {dueLabel ? <span className="shrink-0 text-[11px] text-slate-400">{dueLabel}</span> : null}
                      </div>
                      {task.priority ? (
                        <span className="mt-2 inline-flex rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                          {task.priority}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {showSheet ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-xl rounded-t-[28px] border border-white/10 bg-slate-800 p-5 shadow-2xl shadow-slate-950/60 sm:rounded-[24px] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{editingId ? 'Edit Task' : 'New Task'}</p>
              <button type="button" onClick={closeSheet} className="text-sm text-slate-400 transition hover:text-slate-200">
                Close
              </button>
            </div>
            <form
              onSubmit={(event) => {
                if (editingId) {
                  event.preventDefault()
                  saveEdit(editingId)
                  return
                }
                addTask(event)
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Task title"
                required
              />
              <textarea
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                className="min-h-24 w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Optional note"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                />
                <input
                  type="time"
                  value={form.dueTime}
                  onChange={(event) => setForm({ ...form, dueTime: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                />
              </div>
              <select
                value={form.priority}
                onChange={(event) => setForm({ ...form, priority: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
              >
                <option value="">No priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={closeSheet}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Save' : 'Add Task'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Add Task"
        onClick={() => {
          setEditingId(null)
          setForm(EMPTY_FORM)
          setShowSheet(true)
        }}
        className="fixed bottom-24 right-20 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-indigo-300/40 bg-gradient-to-br from-indigo-400 to-indigo-600 text-3xl font-semibold text-white shadow-2xl shadow-indigo-950/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-indigo-900/60 lg:bottom-8"
      >
        +
      </button>
    </div>
  )
}
