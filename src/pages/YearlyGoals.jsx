import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Buttons'
import { EmptyState } from '../components/EmptyState'
import { createId } from '../services/storage'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  targetMonth: '',
}

function toPositiveNumber(value, fallback = 0) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(0, parsed)
}

function calculatePercent(currentValue, targetValue) {
  if (targetValue <= 0) return 0
  return Math.min(100, Math.round((currentValue / targetValue) * 100))
}

function normalizeYearlyGoal(goal) {
  const targetValue = toPositiveNumber(goal.targetValue ?? goal.target, 100)
  const fallbackCurrent = toPositiveNumber(goal.progress, 0)
  const currentValue = Math.min(toPositiveNumber(goal.currentValue, fallbackCurrent), targetValue)
  const progress = calculatePercent(currentValue, targetValue)

  return {
    ...goal,
    targetValue,
    target: targetValue,
    currentValue,
    progress,
    completed: progress >= 100,
  }
}

export function YearlyGoals({ yearlyGoals, setYearlyGoals, showToast }) {
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

  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const completedCount = useMemo(() => yearlyGoals.filter((goal) => goal.completed).length, [yearlyGoals])
  const progressPercent = useMemo(
    () => Math.round((completedCount / Math.max(yearlyGoals.length, 1)) * 100),
    [completedCount, yearlyGoals.length],
  )

  useEffect(() => {
    if (!lastAddedId) return
    const timeout = setTimeout(() => setLastAddedId(null), 350)
    return () => clearTimeout(timeout)
  }, [lastAddedId])

  useEffect(() => {
    setSwipeOffsetById((current) => {
      const next = {}
      yearlyGoals.forEach((goal) => {
        if (Object.prototype.hasOwnProperty.call(current, goal.id)) {
          next[goal.id] = current[goal.id]
        }
      })
      return next
    })
  }, [yearlyGoals])

  useEffect(() => {
    const normalized = yearlyGoals.map(normalizeYearlyGoal)
    const hasChanges = normalized.some((goal, index) => {
      const original = yearlyGoals[index]
      return (
        goal.targetValue !== original.targetValue ||
        goal.target !== original.target ||
        goal.currentValue !== original.currentValue ||
        goal.progress !== original.progress ||
        goal.completed !== original.completed
      )
    })

    if (hasChanges) {
      setYearlyGoals(normalized)
    }
  }, [setYearlyGoals, yearlyGoals])

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const addGoal = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const description = form.description.trim()
    const dueDate = form.targetMonth ? `${form.targetMonth}-01` : ''
    const nextGoal = {
      id: createId('yearly'),
      title: form.title.trim(),
      description,
      notes: description,
      category: form.category.trim() || 'Growth',
      targetMonth: form.targetMonth || '',
      dueDate,
      targetValue: 100,
      currentValue: 0,
      target: 100,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setYearlyGoals((current) => [...current, normalizeYearlyGoal(nextGoal)])
    setLastAddedId(nextGoal.id)
    setShowSheet(false)
    setForm(EMPTY_FORM)
    showToast('Yearly goal added')
  }

  const saveEdit = (goalId) => {
    const payload = form.title.trim()
    if (!payload) return

    const description = form.description.trim()
    const dueDate = form.targetMonth ? `${form.targetMonth}-01` : ''
    setYearlyGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? normalizeYearlyGoal({
              ...goal,
              title: payload,
              description,
              notes: description,
              category: form.category.trim() || 'Growth',
              targetMonth: form.targetMonth || '',
              dueDate,
            })
          : goal,
      ),
    )

    setEditingId(null)
    setShowSheet(false)
    setForm(EMPTY_FORM)
    showToast('Goal updated')
  }

  const toggleGoal = (goalId) => {
    setYearlyGoals((current) =>
      current.map((goal) => {
        if (goal.id !== goalId) return goal

        const normalized = normalizeYearlyGoal(goal)
        const completed = !normalized.completed
        const currentValue = completed ? normalized.targetValue : 0

        return normalizeYearlyGoal({
          ...normalized,
          currentValue,
        })
      }),
    )
  }

  const deleteGoal = (goalId) => {
    setYearlyGoals((current) => current.filter((goal) => goal.id !== goalId))
    setSwipeOffsetById((current) => {
      const next = { ...current }
      delete next[goalId]
      return next
    })
    showToast('Goal removed')
  }

  const startEdit = (goal) => {
    const rawTargetMonth = goal.targetMonth || (goal.dueDate ? goal.dueDate.slice(0, 7) : '')
    setEditingId(goal.id)
    setShowSheet(true)
    setForm({
      title: goal.title || '',
      description: goal.description || goal.notes || '',
      category: goal.category || '',
      targetMonth: rawTargetMonth,
    })
  }

  const reorderGoals = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return

    setYearlyGoals((current) => {
      const next = [...current]
      const fromIndex = next.findIndex((goal) => goal.id === sourceId)
      const toIndex = next.findIndex((goal) => goal.id === targetId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handleRowPointerDown = (event, goalId) => {
    if (event.button !== 0) return

    clearHoldTimer()
    interactionRef.current = {
      id: goalId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      dragging: false,
      swipeLocked: false,
    }

    holdTimerRef.current = setTimeout(() => {
      interactionRef.current.dragging = true
      setDraggingId(goalId)
      setDragOverId(goalId)
      setSwipeOffsetById((current) => ({ ...current, [goalId]: 0 }))
    }, 280)
  }

  const handleRowPointerMove = (event, goalId) => {
    const interaction = interactionRef.current
    if (interaction.id !== goalId || interaction.pointerId !== event.pointerId) return

    const deltaX = event.clientX - interaction.startX
    const deltaY = event.clientY - interaction.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > 6 || absY > 6) interaction.moved = true

    if (interaction.dragging) {
      event.preventDefault()
      const rowAtPoint = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-yearly-row-id]')
      const overId = rowAtPoint?.getAttribute('data-yearly-row-id') || null
      setDragOverId(overId)
      return
    }

    if (!interaction.swipeLocked && absY > absX && absY > 10) {
      clearHoldTimer()
      return
    }

    if (absX > 8 && absX > absY) {
      clearHoldTimer()
      interaction.swipeLocked = true
      const offset = Math.max(-112, Math.min(112, deltaX))
      setSwipeOffsetById((current) => ({ ...current, [goalId]: offset }))
    }
  }

  const handleRowPointerUp = (event, goal) => {
    const interaction = interactionRef.current
    if (interaction.id !== goal.id || interaction.pointerId !== event.pointerId) return

    clearHoldTimer()
    const currentOffset = swipeOffsetById[goal.id] || 0

    if (interaction.dragging) {
      if (dragOverId && dragOverId !== goal.id) reorderGoals(goal.id, dragOverId)
      setDraggingId(null)
      setDragOverId(null)
      setSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
    } else if (Math.abs(currentOffset) >= 72) {
      setSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
      deleteGoal(goal.id)
    } else {
      setSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
      if (!interaction.moved) startEdit(goal)
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

  const closeSheet = () => {
    setShowSheet(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const formatTargetMonth = (goal) => {
    const value = goal.targetMonth || (goal.dueDate ? goal.dueDate.slice(0, 7) : '')
    if (!value) return ''
    const date = new Date(`${value}-01T00:00:00`)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-4 pb-24 lg:pb-6">
      <section className="rounded-[24px] border border-white/10 bg-slate-800/90 p-4 shadow-[0_18px_38px_rgba(2,6,23,0.42)] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Planner</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-50 sm:text-3xl">Yearly Goals</h1>
            <p className="mt-1 text-sm text-slate-300">{currentYear}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300">
            {completedCount}/{yearlyGoals.length} completed
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-700/70">
          <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      {yearlyGoals.length === 0 ? (
        <EmptyState
          title="No yearly goals yet"
          description="Define long-range milestones and shape your year with focus."
          action={
            <Button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(EMPTY_FORM)
                setShowSheet(true)
              }}
            >
              Add your first yearly goal
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/95 shadow-[0_14px_28px_rgba(2,6,23,0.4)]">
          <ul className="divide-y divide-white/10">
            {yearlyGoals.map((goal) => {
              const rowOffset = swipeOffsetById[goal.id] || 0
              const isDragging = draggingId === goal.id
              const isDragTarget = dragOverId === goal.id && draggingId !== goal.id
              const detail = goal.description || goal.notes || ''
              const targetMonthLabel = formatTargetMonth(goal)

              return (
                <li key={goal.id} className={`group relative ${isDragTarget ? 'bg-blue-500/10' : ''}`}>
                  <article
                    data-yearly-row-id={goal.id}
                    onPointerDown={(event) => handleRowPointerDown(event, goal.id)}
                    onPointerMove={(event) => handleRowPointerMove(event, goal.id)}
                    onPointerUp={(event) => handleRowPointerUp(event, goal)}
                    onPointerCancel={() => {
                      clearHoldTimer()
                      setDraggingId(null)
                      setDragOverId(null)
                      setSwipeOffsetById((current) => ({ ...current, [goal.id]: 0 }))
                    }}
                    style={{ transform: `translateX(${rowOffset}px)` }}
                    className={`relative flex cursor-grab select-none items-start gap-3 bg-slate-800/95 px-4 py-3 transition-[transform,box-shadow,background-color] duration-200 active:cursor-grabbing ${isDragging ? 'z-20 scale-[1.01] shadow-[0_18px_34px_rgba(2,6,23,0.55)]' : ''} ${goal.completed ? 'bg-emerald-500/10' : ''} ${lastAddedId === goal.id ? 'goal-card-enter' : ''}`}
                  >
                    <label className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center" onPointerDown={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoal(goal.id)}
                        className="h-5 w-5 rounded-md border border-slate-500 bg-slate-900 transition-all duration-200 checked:scale-110 checked:border-indigo-400 checked:bg-indigo-500 focus:ring-2 focus:ring-indigo-400/40"
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`truncate text-[15px] font-semibold ${goal.completed ? 'text-emerald-300 line-through' : 'text-slate-50'}`}>{goal.title}</p>
                          {detail ? <p className="mt-0.5 truncate text-sm text-slate-300">{detail}</p> : null}
                        </div>
                        {targetMonthLabel ? <span className="shrink-0 text-[11px] text-slate-400">{targetMonthLabel}</span> : null}
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

      {showSheet ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-xl rounded-t-[28px] border border-white/10 bg-slate-800 p-5 shadow-2xl shadow-slate-950/60 sm:rounded-[24px] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{editingId ? 'Edit Yearly Goal' : 'New Yearly Goal'}</p>
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
                addGoal(event)
              }}
              className="mt-4 space-y-3"
            >
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Goal title"
                required
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-24 w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Optional description"
              />
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
                placeholder="Optional category"
              />
              <input
                type="month"
                value={form.targetMonth}
                onChange={(event) => setForm({ ...form, targetMonth: event.target.value })}
                className="w-full rounded-[16px] border border-white/10 bg-slate-900 px-4 py-3 text-slate-50"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={closeSheet}>Cancel</Button>
                <Button type="submit">{editingId ? 'Save' : 'Add Goal'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Add Yearly Goal"
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
