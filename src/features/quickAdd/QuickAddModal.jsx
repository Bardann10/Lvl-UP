import { useMemo, useState } from 'react'
import { Modal } from '../../shared/ui/Modal'
import { Button } from '../../shared/ui/Button'
import { PlannerInput, PlannerSelect, PlannerTextarea } from '../../shared/ui/PlannerField'

export function QuickAddModal({ open, onClose, onAddDailyGoal, onAddTask, showToast }) {
  const [mode, setMode] = useState('goal')
  const [goalForm, setGoalForm] = useState({ title: '', category: '', notes: '', icon: 'star', color: 'sky' })
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    priority: 'Medium',
    color: 'violet',
  })

  const title = useMemo(() => (mode === 'goal' ? 'Quick add daily goal' : 'Quick add to-do task'), [mode])

  const handleGoalSave = (event) => {
    event.preventDefault()
    if (!goalForm.title.trim()) return
    onAddDailyGoal(goalForm)
    setGoalForm({ title: '', category: '', notes: '', icon: 'star', color: 'sky' })
    onClose()
    showToast('Daily goal added')
  }

  const handleTaskSave = (event) => {
    event.preventDefault()
    if (!taskForm.title.trim()) return
    onAddTask(taskForm)
    setTaskForm({
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      priority: 'Medium',
      color: 'violet',
    })
    onClose()
    showToast('Task added')
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
            Quick Add
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">
            Capture a habit or task in the same premium flow used across the planner.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onClose} className="px-3 py-2">
          Close
        </Button>
      </div>

      <div className="app-inset mt-5 flex gap-2 p-1.5">
        <Button
          variant={mode === 'goal' ? 'primary' : 'ghost'}
          type="button"
          className="flex-1"
          onClick={() => setMode('goal')}
        >
          Daily Goal
        </Button>
        <Button
          variant={mode === 'task' ? 'primary' : 'ghost'}
          type="button"
          className="flex-1"
          onClick={() => setMode('task')}
        >
          To-Do
        </Button>
      </div>

      {mode === 'goal' ? (
        <form onSubmit={handleGoalSave} className="mt-5 space-y-3">
          <PlannerInput
            value={goalForm.title}
            onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
            className="w-full"
            size="lg"
            placeholder="Goal title"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <PlannerInput
              value={goalForm.category}
              onChange={(event) => setGoalForm({ ...goalForm, category: event.target.value })}
              className="w-full"
              placeholder="Category"
            />
            <PlannerInput
              value={goalForm.icon}
              onChange={(event) => setGoalForm({ ...goalForm, icon: event.target.value })}
              className="w-full"
              placeholder="Icon name"
            />
          </div>
          <PlannerTextarea
            value={goalForm.notes}
            onChange={(event) => setGoalForm({ ...goalForm, notes: event.target.value })}
            className="min-h-28 w-full"
            placeholder="Notes"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <PlannerInput
              type="time"
              value={goalForm.reminderTime || ''}
              onChange={(event) => setGoalForm({ ...goalForm, reminderTime: event.target.value })}
              className="w-full"
            />
            <PlannerSelect
              value={goalForm.color}
              onChange={(event) => setGoalForm({ ...goalForm, color: event.target.value })}
              className="w-full"
            >
              <option value="sky">Sky</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="amber">Amber</option>
            </PlannerSelect>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add goal</Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleTaskSave} className="mt-5 space-y-3">
          <PlannerInput
            value={taskForm.title}
            onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
            className="w-full"
            size="lg"
            placeholder="Task title"
          />
          <PlannerTextarea
            value={taskForm.description}
            onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            className="min-h-28 w-full"
            placeholder="Task description"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <PlannerInput
              type="date"
              value={taskForm.date}
              onChange={(event) => setTaskForm({ ...taskForm, date: event.target.value })}
              className="w-full"
            />
            <PlannerInput
              type="time"
              value={taskForm.reminderTime || ''}
              onChange={(event) => setTaskForm({ ...taskForm, reminderTime: event.target.value })}
              className="w-full"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <PlannerSelect
              value={taskForm.priority}
              onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
              className="w-full"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </PlannerSelect>
            <PlannerSelect
              value={taskForm.color}
              onChange={(event) => setTaskForm({ ...taskForm, color: event.target.value })}
              className="w-full"
            >
              <option value="sky">Sky</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="amber">Amber</option>
            </PlannerSelect>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add task</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
