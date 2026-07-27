import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
import { createId } from '../services/storage'
import { getTodayLabel, todayKey } from '../utils/date'

const EMPTY_GOAL_FORM = {
  title: '',
  notes: '',
  category: '',
  priority: 'medium',
  repeatSchedule: 'daily',
  icon: 'self_improvement',
  color: 'sky',
}

const EMPTY_TASK_FORM = {
  title: '',
  notes: '',
  dueDate: '',
  dueTime: '',
  priority: '',
}

export function DailyTargets({ dailyGoals, tasks, setDailyGoals, setTasks, showToast }) {
  const [goalForm, setGoalForm] = useState(EMPTY_GOAL_FORM)
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM)
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [showGoalSheet, setShowGoalSheet] = useState(false)
  const [showTaskSheet, setShowTaskSheet] = useState(false)
  const [showFabOptions, setShowFabOptions] = useState(false)
  const [selectedTaskDate, setSelectedTaskDate] = useState(todayKey())
  const [lastAddedGoalId, setLastAddedGoalId] = useState(null)
  const [lastAddedTaskId, setLastAddedTaskId] = useState(null)
  const [goalSwipeOffsetById, setGoalSwipeOffsetById] = useState({})
  const [taskSwipeOffsetById, setTaskSwipeOffsetById] = useState({})
  const [draggingGoalId, setDraggingGoalId] = useState(null)
  const [dragOverGoalId, setDragOverGoalId] = useState(null)
  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [dragOverTaskId, setDragOverTaskId] = useState(null)

  const goalInteractionRef = useRef({
    id: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
    dragging: false,
    swipeLocked: false,
  })
  const taskInteractionRef = useRef({
    id: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
    dragging: false,
    swipeLocked: false,
  })
  const goalHoldTimerRef = useRef(null)
  const taskHoldTimerRef = useRef(null)

  const visibleTasks = useMemo(
    () => tasks.filter((task) => (task.dueDate || task.date || '') === selectedTaskDate),
    [tasks, selectedTaskDate],
  )
  const completedTaskCount = useMemo(() => visibleTasks.filter((task) => task.completed).length, [visibleTasks])
  const remainingTaskCount = useMemo(() => Math.max(0, visibleTasks.length - completedTaskCount), [visibleTasks.length, completedTaskCount])

  const completedTodayCount = useMemo(() => dailyGoals.filter((goal) => goal.completedDates.includes(todayKey())).length, [dailyGoals])
  const progressPercent = useMemo(() => Math.round((completedTodayCount / Math.max(dailyGoals.length, 1)) * 100), [completedTodayCount, dailyGoals.length])

  useEffect(() => {
    if (!lastAddedGoalId) return
    const timeout = setTimeout(() => setLastAddedGoalId(null), 350)
    return () => clearTimeout(timeout)
  }, [lastAddedGoalId])

  useEffect(() => {
    if (!lastAddedTaskId) return
    const timeout = setTimeout(() => setLastAddedTaskId(null), 350)
    return () => clearTimeout(timeout)
  }, [lastAddedTaskId])

  useEffect(() => {
    if (dailyGoals.length === 0) setShowGoalSheet(true)
  }, [dailyGoals.length])

  useEffect(() => {
    setGoalSwipeOffsetById((current) => {
      const next = {}
      dailyGoals.forEach((goal) => {
        if (Object.prototype.hasOwnProperty.call(current, goal.id)) {
          next[goal.id] = current[goal.id]
        }
      })
      return next
    })
  }, [dailyGoals])

  useEffect(() => {
    setTaskSwipeOffsetById((current) => {
      const next = {}
      tasks.forEach((task) => {
        if (Object.prototype.hasOwnProperty.call(current, task.id)) {
          next[task.id] = current[task.id]
        }
      })
      return next
    })
  }, [tasks])

  const clearGoalHoldTimer = () => {
    if (goalHoldTimerRef.current) {
      clearTimeout(goalHoldTimerRef.current)
      goalHoldTimerRef.current = null
    }
  }

  const clearTaskHoldTimer = () => {
    if (taskHoldTimerRef.current) {
      clearTimeout(taskHoldTimerRef.current)
      taskHoldTimerRef.current = null
    }
  }

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
    if (!goalForm.title.trim()) return

    const nextGoal = {
      id: createId('goal'),
      title: goalForm.title.trim(),
      category: goalForm.category.trim() || 'General',
      notes: goalForm.notes.trim(),
      priority: goalForm.priority || 'medium',
      repeatSchedule: goalForm.repeatSchedule || 'daily',
      icon: goalForm.icon || 'self_improvement',
      color: goalForm.color || 'sky',
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
    }

    setDailyGoals((current) => [...current, nextGoal])

    setLastAddedGoalId(nextGoal.id)
    setShowGoalSheet(false)
    setGoalForm(EMPTY_GOAL_FORM)
    showToast('Daily goal added')
  }

  const saveEdit = (goalId) => {
    const payload = goalForm.title.trim()
    if (!payload) return

    setDailyGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              title: payload,
              category: goalForm.category.trim() || 'General',
              notes: goalForm.notes.trim(),
              priority: goalForm.priority || goal.priority || 'medium',
              repeatSchedule: goalForm.repeatSchedule || goal.repeatSchedule || 'daily',
              icon: goalForm.icon || 'self_improvement',
              color: goalForm.color || 'sky',
            }
          : goal,
      ),
    )

    setEditingGoalId(null)
    setShowGoalSheet(false)
    setGoalForm(EMPTY_GOAL_FORM)
    showToast('Goal updated')
  }

  const deleteGoal = (goalId) => {
    setDailyGoals((current) => current.filter((goal) => goal.id !== goalId))
    setGoalSwipeOffsetById((current) => {
      const next = { ...current }
      delete next[goalId]
      return next
    })
    showToast('Goal removed')
  }

  const startEdit = (goal) => {
    setEditingGoalId(goal.id)
    setShowGoalSheet(true)
    setGoalForm({
      title: goal.title,
      category: goal.category || '',
      notes: goal.notes || '',
      priority: goal.priority || 'medium',
      repeatSchedule: goal.repeatSchedule || 'daily',
      icon: goal.icon || 'self_improvement',
      color: goal.color || 'sky',
    })
  }

  const reorderGoals = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return

    setDailyGoals((current) => {
      const next = [...current]
      const fromIndex = next.findIndex((goal) => goal.id === sourceId)
      const toIndex = next.findIndex((goal) => goal.id === targetId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const addTask = (event) => {
    event.preventDefault()
    if (!taskForm.title.trim()) return

    const note = taskForm.notes.trim()
    const taskDate = taskForm.dueDate || selectedTaskDate
    const nextTask = {
      id: createId('task'),
      title: taskForm.title.trim(),
      notes: note,
      description: note,
      dueDate: taskDate,
      dueTime: taskForm.dueTime || '',
      date: taskDate,
      reminderTime: taskForm.dueTime || '',
      priority: taskForm.priority || '',
      color: 'amber',
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((current) => [...current, nextTask])
    setSelectedTaskDate(taskDate)
    setLastAddedTaskId(nextTask.id)
    setShowTaskSheet(false)
    setTaskForm(EMPTY_TASK_FORM)
    showToast('Task added')
  }

  const saveTaskEdit = (taskId) => {
    if (!taskForm.title.trim()) return

    const note = taskForm.notes.trim()
    const taskDate = taskForm.dueDate || selectedTaskDate
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: taskForm.title.trim(),
              notes: note,
              description: note,
              dueDate: taskDate,
              dueTime: taskForm.dueTime || '',
              date: taskDate,
              reminderTime: taskForm.dueTime || '',
              priority: taskForm.priority || '',
            }
          : task,
      ),
    )

    setSelectedTaskDate(taskDate)
    setEditingTaskId(null)
    setShowTaskSheet(false)
    setTaskForm(EMPTY_TASK_FORM)
    showToast('Task updated')
  }

  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    setTaskSwipeOffsetById((current) => {
      const next = { ...current }
      delete next[taskId]
      return next
    })
    showToast('Task removed')
  }

  const startTaskEdit = (task) => {
    setEditingTaskId(task.id)
    setShowTaskSheet(true)
    setTaskForm({
      title: task.title || '',
      notes: task.notes || task.description || '',
      dueDate: task.dueDate || task.date || selectedTaskDate,
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

  const handleRowPointerDown = (event, goalId) => {
    if (event.button !== 0) return

    clearGoalHoldTimer()
    goalInteractionRef.current = {
      id: goalId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }

    goalHoldTimerRef.current = setTimeout(() => {
      goalInteractionRef.current.dragging = true
      setDraggingGoalId(goalId)
      setDragOverGoalId(goalId)
      setGoalSwipeOffsetById((current) => ({ ...current, [goalId]: 0 }))
    }, 280)
  }

  const handleRowPointerMove = (event, goalId) => {
    const interaction = goalInteractionRef.current
    if (interaction.id !== goalId || interaction.pointerId !== event.pointerId) return

    const deltaX = event.clientX - interaction.startX
    const deltaY = event.clientY - interaction.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > 6 || absY > 6) {
      interaction.moved = true
    }

    if (interaction.dragging) {
      event.preventDefault()
      const rowAtPoint = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-goal-row-id]')
      const overId = rowAtPoint?.getAttribute('data-goal-row-id') || null
      setDragOverGoalId(overId)
      return
    }

    if (!interaction.swipeLocked && absY > absX && absY > 10) {
      clearGoalHoldTimer()
      return
    }

    if (absX > 8 && absX > absY) {
      clearGoalHoldTimer()
      interaction.swipeLocked = true
      const offset = Math.max(-112, Math.min(88, deltaX))
      setGoalSwipeOffsetById((current) => ({ ...current, [goalId]: offset }))
    }
  }

  const handleRowPointerUp = (event, goal) => {
    const interaction = goalInteractionRef.current
    if (interaction.id !== goal.id || interaction.pointerId !== event.pointerId) return

    clearGoalHoldTimer()
    const currentOffset = goalSwipeOffsetById[goal.id] || 0

    if (interaction.dragging) {
      if (dragOverGoalId && dragOverGoalId !== goal.id) {
        reorderGoals(goal.id, dragOverGoalId)
      }
      setDraggingGoalId(null)
      setDragOverGoalId(null)
      setGoalSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
    } else if (currentOffset <= -72) {
      setGoalSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
      deleteGoal(goal.id)
    } else if (currentOffset >= 68) {
      setGoalSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
      toggleGoal(goal.id)
    } else {
      setGoalSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
      if (!interaction.moved) {
        startEdit(goal)
      }
    }

    goalInteractionRef.current = {
      id: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }
  }

  const handleTaskPointerDown = (event, taskId) => {
    if (event.button !== 0) return

    clearTaskHoldTimer()
    taskInteractionRef.current = {
      id: taskId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }

    taskHoldTimerRef.current = setTimeout(() => {
      taskInteractionRef.current.dragging = true
      setDraggingTaskId(taskId)
      setDragOverTaskId(taskId)
      setTaskSwipeOffsetById((current) => ({ ...current, [taskId]: 0 }))
    }, 280)
  }

  const handleTaskPointerMove = (event, taskId) => {
    const interaction = taskInteractionRef.current
    if (interaction.id !== taskId || interaction.pointerId !== event.pointerId) return

    const deltaX = event.clientX - interaction.startX
    const deltaY = event.clientY - interaction.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > 6 || absY > 6) interaction.moved = true

    if (interaction.dragging) {
      event.preventDefault()
      const rowAtPoint = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-task-row-id]')
      const overId = rowAtPoint?.getAttribute('data-task-row-id') || null
      setDragOverTaskId(overId)
      return
    }

    if (!interaction.swipeLocked && absY > absX && absY > 10) {
      clearTaskHoldTimer()
      return
    }

    if (absX > 8 && absX > absY) {
      clearTaskHoldTimer()
      interaction.swipeLocked = true
      const offset = Math.max(-112, Math.min(88, deltaX))
      setTaskSwipeOffsetById((current) => ({ ...current, [taskId]: offset }))
    }
  }

  const handleTaskPointerUp = (event, task) => {
    const interaction = taskInteractionRef.current
    if (interaction.id !== task.id || interaction.pointerId !== event.pointerId) return

    clearTaskHoldTimer()
    const currentOffset = taskSwipeOffsetById[task.id] || 0

    if (interaction.dragging) {
      if (dragOverTaskId && dragOverTaskId !== task.id) {
        reorderTasks(task.id, dragOverTaskId)
      }
      setDraggingTaskId(null)
      setDragOverTaskId(null)
      setTaskSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
    } else if (currentOffset <= -72) {
      setTaskSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      deleteTask(task.id)
    } else if (currentOffset >= 68) {
      setTaskSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      toggleTask(task.id)
    } else {
      setTaskSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
      if (!interaction.moved) startTaskEdit(task)
    }

    taskInteractionRef.current = {
      id: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }
  }

  const formatCreatedDate = (goal) => {
    const value = goal.createdAt || goal.createdDate
    if (!value) return 'Legacy goal'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Legacy goal'
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const closeGoalSheet = () => {
    setShowGoalSheet(false)
    setEditingGoalId(null)
    setGoalForm(EMPTY_GOAL_FORM)
  }

  const closeTaskSheet = () => {
    setShowTaskSheet(false)
    setEditingTaskId(null)
    setTaskForm(EMPTY_TASK_FORM)
  }

  const taskDateOptions = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)
    const toKey = (date) => date.toISOString().slice(0, 10)
    return [
      { key: toKey(today), label: 'Today' },
      { key: toKey(tomorrow), label: 'Tomorrow' },
      { key: toKey(nextWeek), label: 'Next Week' },
      { key: toKey(nextMonth), label: 'Next Month' },
    ]
  }, [])

  const formatTaskDue = (task) => {
    const dueDate = task.dueDate || task.date
    const dueTime = task.dueTime || task.reminderTime
    if (!dueDate && !dueTime) return ''
    if (dueDate && dueTime) return `${dueDate} ${dueTime}`
    return dueDate || dueTime || ''
  }

  const selectedDateLabel = useMemo(() => {
    if (!selectedTaskDate) return getTodayLabel()
    const date = new Date(`${selectedTaskDate}T00:00:00`)
    if (Number.isNaN(date.getTime())) return getTodayLabel()
    return date.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
  }, [selectedTaskDate])

  return (
    <div className="space-y-4 pb-24 lg:pb-6">
      <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/95 shadow-[0_14px_28px_rgba(2,6,23,0.4)]">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Planner</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-50">To-Do Tasks</h2>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300">
              {completedTaskCount} done · {remainingTaskCount} remaining
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {taskDateOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedTaskDate(option.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedTaskDate === option.key ? 'border-sky-300/40 bg-sky-400/20 text-sky-100' : 'border-white/10 bg-slate-900/65 text-slate-300 hover:border-slate-400/40 hover:text-slate-100'}`}
              >
                {option.label}
              </button>
            ))}
            <input
              type="date"
              value={selectedTaskDate}
              onChange={(event) => setSelectedTaskDate(event.target.value)}
              className="rounded-full border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
            />
          </div>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400 sm:px-5">
            No tasks scheduled for {selectedTaskDate}. Add one from the + button.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {visibleTasks.map((task) => {
              const rowOffset = taskSwipeOffsetById[task.id] || 0
              const isDragging = draggingTaskId === task.id
              const isDragTarget = dragOverTaskId === task.id && draggingTaskId !== task.id
              const taskNote = task.notes || task.description || ''
              const dueLabel = formatTaskDue(task)

              return (
                <li key={task.id} className={`group relative ${isDragTarget ? 'bg-blue-500/10' : ''}`}>
                  <article
                    data-task-row-id={task.id}
                    onPointerDown={(event) => handleTaskPointerDown(event, task.id)}
                    onPointerMove={(event) => handleTaskPointerMove(event, task.id)}
                    onPointerUp={(event) => handleTaskPointerUp(event, task)}
                    onPointerCancel={() => {
                      clearTaskHoldTimer()
                      setDraggingTaskId(null)
                      setDragOverTaskId(null)
                      setTaskSwipeOffsetById((current) => ({ ...current, [task.id]: 0 }))
                    }}
                    style={{ transform: `translateX(${rowOffset}px)` }}
                    className={`relative flex cursor-grab select-none items-start gap-3 bg-slate-800/95 px-4 py-3 transition-[transform,box-shadow,background-color] duration-200 active:cursor-grabbing ${isDragging ? 'z-20 scale-[1.01] shadow-[0_18px_34px_rgba(2,6,23,0.55)]' : ''} ${task.completed ? 'bg-emerald-500/10' : ''} ${lastAddedTaskId === task.id ? 'goal-card-enter' : ''}`}
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
                          {taskNote ? <p className="mt-0.5 truncate text-sm text-slate-300">{taskNote}</p> : null}
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
        )}

      </section>

      <section className="rounded-[24px] border border-white/10 bg-slate-800/90 p-4 shadow-[0_18px_38px_rgba(2,6,23,0.42)] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Planner</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-50 sm:text-3xl">Daily Goals</h1>
            <p className="mt-1 text-sm text-slate-300">{selectedDateLabel}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300">
            {completedTodayCount}/{dailyGoals.length} completed
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-700/70">
          <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      {dailyGoals.length === 0 ? (
        <EmptyState
          title="No daily goals yet"
          description="Create your first recurring habit, check it off, and build consistent momentum every day."
          action={
            <Button
              type="button"
              onClick={() => {
                setEditingGoalId(null)
                setGoalForm(EMPTY_GOAL_FORM)
                setShowGoalSheet(true)
              }}
            >
              Add your first goal
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/95 shadow-[0_14px_28px_rgba(2,6,23,0.4)]">
          <ul className="divide-y divide-white/10">
            {dailyGoals.map((goal) => {
              const doneToday = goal.completedDates.includes(todayKey())
              const rowOffset = goalSwipeOffsetById[goal.id] || 0
              const isDragging = draggingGoalId === goal.id
              const isDragTarget = dragOverGoalId === goal.id && draggingGoalId !== goal.id

              return (
                <li key={goal.id} className={`group relative ${isDragTarget ? 'bg-blue-500/10' : ''}`}>
                  <article
                    data-goal-row-id={goal.id}
                    onPointerDown={(event) => handleRowPointerDown(event, goal.id)}
                    onPointerMove={(event) => handleRowPointerMove(event, goal.id)}
                    onPointerUp={(event) => handleRowPointerUp(event, goal)}
                    onPointerCancel={() => {
                      clearGoalHoldTimer()
                      setDraggingGoalId(null)
                      setDragOverGoalId(null)
                      setGoalSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
                    }}
                    style={{ transform: `translateX(${rowOffset}px)` }}
                    className={`relative flex cursor-grab select-none items-start gap-3 bg-slate-800/95 px-4 py-3 transition-[transform,box-shadow,background-color] duration-200 active:cursor-grabbing ${isDragging ? 'z-20 scale-[1.01] shadow-[0_18px_34px_rgba(2,6,23,0.55)]' : ''} ${doneToday ? 'bg-emerald-500/10' : ''} ${lastAddedGoalId === goal.id ? 'goal-card-enter' : ''}`}
                  >
                    <label className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center" onPointerDown={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={doneToday}
                        onChange={() => toggleGoal(goal.id)}
                        className="h-5 w-5 rounded-md border border-slate-500 bg-slate-900 transition-all duration-200 checked:scale-110 checked:border-indigo-400 checked:bg-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`truncate text-[15px] font-semibold ${doneToday ? 'text-emerald-300 line-through' : 'text-slate-50'}`}>{goal.title}</p>
                          {goal.notes ? <p className="mt-0.5 truncate text-sm text-slate-300">{goal.notes}</p> : null}
                        </div>
                        <span className="shrink-0 text-[11px] text-slate-400">{formatCreatedDate(goal)}</span>
                      </div>
                      {goal.category ? (
                        <span className="mt-2 inline-flex rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                          {goal.category}
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

      {showGoalSheet ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-xl rounded-t-[28px] border border-white/10 bg-slate-800 p-5 shadow-2xl shadow-slate-950/60 sm:rounded-[24px] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{editingGoalId ? 'Edit Goal' : 'New Goal'}</p>
              <button
                type="button"
                onClick={closeGoalSheet}
                className="text-sm text-slate-400 transition hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={(event) => {
                if (editingGoalId) {
                  event.preventDefault()
                  saveEdit(editingGoalId)
                  return
                }
                addGoal(event)
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={goalForm.title}
                onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Goal title"
                required
              />
              <textarea
                value={goalForm.notes}
                onChange={(event) => setGoalForm({ ...goalForm, notes: event.target.value })}
                className="min-h-24 w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Optional note"
              />
              <input
                value={goalForm.category}
                onChange={(event) => setGoalForm({ ...goalForm, category: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Category"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  value={goalForm.priority}
                  onChange={(event) => setGoalForm({ ...goalForm, priority: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
                <select
                  value={goalForm.repeatSchedule}
                  onChange={(event) => setGoalForm({ ...goalForm, repeatSchedule: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                >
                  <option value="daily">Repeat daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={closeGoalSheet}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingGoalId ? 'Save' : 'Add Goal'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showTaskSheet ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-xl rounded-t-[28px] border border-white/10 bg-slate-800 p-5 shadow-2xl shadow-slate-950/60 sm:rounded-[24px] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{editingTaskId ? 'Edit Task' : 'New Task'}</p>
              <button
                type="button"
                onClick={closeTaskSheet}
                className="text-sm text-slate-400 transition hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={(event) => {
                if (editingTaskId) {
                  event.preventDefault()
                  saveTaskEdit(editingTaskId)
                  return
                }
                addTask(event)
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={taskForm.title}
                onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Task title"
                required
              />
              <textarea
                value={taskForm.notes}
                onChange={(event) => setTaskForm({ ...taskForm, notes: event.target.value })}
                className="min-h-24 w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Optional note"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                />
                <input
                  type="time"
                  value={taskForm.dueTime}
                  onChange={(event) => setTaskForm({ ...taskForm, dueTime: event.target.value })}
                  className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                />
              </div>
              <select
                value={taskForm.priority}
                onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
              >
                <option value="">No priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={closeTaskSheet}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingTaskId ? 'Save' : 'Add Task'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showFabOptions ? (
        <div className="fixed bottom-40 right-20 z-40 flex min-w-[172px] flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-slate-950/60">
          <button
            type="button"
            onClick={() => {
              setShowFabOptions(false)
              setEditingTaskId(null)
              setTaskForm({ ...EMPTY_TASK_FORM, dueDate: selectedTaskDate })
              setShowTaskSheet(true)
            }}
            className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Add To-Do Task
          </button>
          <button
            type="button"
            onClick={() => {
              setShowFabOptions(false)
              setEditingGoalId(null)
              setGoalForm(EMPTY_GOAL_FORM)
              setShowGoalSheet(true)
            }}
            className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Add Daily Goal
          </button>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Add"
        onClick={() => {
          setShowFabOptions((current) => !current)
        }}
        className="fixed bottom-24 right-20 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-indigo-300/40 bg-gradient-to-br from-indigo-400 to-indigo-600 text-3xl font-semibold text-white shadow-2xl shadow-indigo-950/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-indigo-900/60 lg:bottom-8"
      >
        {showFabOptions ? '×' : '+'}
      </button>

    </div>
  )
}
