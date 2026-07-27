import { useMemo, useState } from 'react'
import { Button } from './Buttons'

export function QuickAddModal({ open, onClose, onAddDailyGoal, onAddTask, showToast }) {
  const [mode, setMode] = useState('goal')
  const [goalForm, setGoalForm] = useState({ title: '', category: '', notes: '', icon: 'star', color: 'sky' })
  const [taskForm, setTaskForm] = useState({ title: '', description: '', date: new Date().toISOString().slice(0, 10), priority: 'Medium', color: 'violet' })

  const title = useMemo(() => (mode === 'goal' ? 'Quick add daily goal' : 'Quick add to-do task'), [mode])

  if (!open) return null

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
    setTaskForm({ title: '', description: '', date: new Date().toISOString().slice(0, 10), priority: 'Medium', color: 'violet' })
    onClose()
    showToast('Task added')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/78 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass-strong w-full max-w-xl rounded-[1.65rem] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Quick Add</p>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-white">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="ui-btn ui-btn-secondary rounded-full px-3 py-2">Close</button>
        </div>

        <div className="mt-5 flex gap-2 rounded-full border border-white/10 bg-slate-950/60 p-1.5">
          <Button variant={mode === 'goal' ? 'primary' : 'secondary'} type="button" onClick={() => setMode('goal')}>Daily Goal</Button>
          <Button variant={mode === 'task' ? 'primary' : 'secondary'} type="button" onClick={() => setMode('task')}>To-Do</Button>
        </div>

        {mode === 'goal' ? (
          <form onSubmit={handleGoalSave} className="mt-4 space-y-3">
            <input value={goalForm.title} onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Goal title" />
            <div className="grid gap-3 md:grid-cols-2">
              <input value={goalForm.category} onChange={(event) => setGoalForm({ ...goalForm, category: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Category" />
              <input value={goalForm.icon} onChange={(event) => setGoalForm({ ...goalForm, icon: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Icon name" />
            </div>
            <textarea value={goalForm.notes} onChange={(event) => setGoalForm({ ...goalForm, notes: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Notes" />
            <div className="grid gap-3 md:grid-cols-2">
              <input type="time" value={goalForm.reminderTime || ''} onChange={(event) => setGoalForm({ ...goalForm, reminderTime: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" />
              <select value={goalForm.color} onChange={(event) => setGoalForm({ ...goalForm, color: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white">
                <option value="sky">Sky</option>
                <option value="emerald">Emerald</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit">Add goal</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTaskSave} className="mt-4 space-y-3">
            <input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Task title" />
            <textarea value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" placeholder="Task description" />
            <div className="grid gap-3 md:grid-cols-2">
              <input type="date" value={taskForm.date} onChange={(event) => setTaskForm({ ...taskForm, date: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" />
              <input type="time" value={taskForm.reminderTime || ''} onChange={(event) => setTaskForm({ ...taskForm, reminderTime: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select value={taskForm.color} onChange={(event) => setTaskForm({ ...taskForm, color: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white">
                <option value="sky">Sky</option>
                <option value="emerald">Emerald</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit">Add task</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
