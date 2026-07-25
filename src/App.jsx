import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { DailyTargets } from './pages/DailyTargets'
import { ToDoTasks } from './pages/ToDoTasks'
import { MonthlyGoals } from './pages/MonthlyGoals'
import { YearlyGoals } from './pages/YearlyGoals'
import { Calendar } from './pages/Calendar'
import { Search } from './pages/Search'
import { Settings } from './pages/Settings'
import { Statistics } from './pages/Statistics'
import { Achievements } from './pages/Achievements'
import { ToastProvider, useToast } from './components/ToastProvider'
import { Fab } from './components/Fab'
import { QuickAddModal } from './components/QuickAddModal'
import { defaultData, loadAppData, saveAppData } from './services/storage'

function AppShell() {
  const { showToast } = useToast()
  const [data, setData] = useState(defaultData)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  useEffect(() => {
    const loaded = loadAppData()
    setData(loaded)
  }, [])

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const setDailyGoals = (updater) => {
    setData((current) => ({ ...current, dailyGoals: typeof updater === 'function' ? updater(current.dailyGoals) : updater }))
  }

  const setTasks = (updater) => {
    setData((current) => ({ ...current, tasks: typeof updater === 'function' ? updater(current.tasks) : updater }))
  }

  const setMonthlyGoals = (updater) => {
    setData((current) => ({ ...current, monthlyGoals: typeof updater === 'function' ? updater(current.monthlyGoals) : updater }))
  }

  const setYearlyGoals = (updater) => {
    setData((current) => ({ ...current, yearlyGoals: typeof updater === 'function' ? updater(current.yearlyGoals) : updater }))
  }

  const setAchievements = (updater) => {
    setData((current) => ({ ...current, achievements: typeof updater === 'function' ? updater(current.achievements || []) : updater }))
  }

  const themeClass = data.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'

  const addDailyGoalFromQuickAdd = (draft) => {
    setDailyGoals((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        title: draft.title.trim(),
        category: draft.category.trim() || 'General',
        notes: draft.notes.trim(),
        reminderTime: draft.reminderTime || '',
        icon: draft.icon || 'star',
        color: draft.color || 'sky',
        completedDates: [],
        streak: 0,
      },
    ])
  }

  const addTaskFromQuickAdd = (draft) => {
    setTasks((current) => [
      ...current,
      {
        id: `${Date.now() + 1}`,
        title: draft.title.trim(),
        description: draft.description.trim(),
        date: draft.date,
        reminderTime: draft.reminderTime || '',
        priority: draft.priority || 'Medium',
        color: draft.color || 'amber',
        completed: false,
      },
    ])
  }

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <Navbar />
      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-6">
        <Sidebar>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
            <p className="font-semibold text-white">Today&apos;s focus</p>
            <p className="mt-1">Keep your streak strong and your priorities clear.</p>
          </div>
        </Sidebar>
        <section className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard dailyGoals={data.dailyGoals} tasks={data.tasks} monthlyGoals={data.monthlyGoals} yearlyGoals={data.yearlyGoals} />} />
            <Route path="/daily-goals" element={<DailyTargets dailyGoals={data.dailyGoals} setDailyGoals={setDailyGoals} showToast={showToast} />} />
            <Route path="/to-do-tasks" element={<ToDoTasks tasks={data.tasks} setTasks={setTasks} showToast={showToast} />} />
            <Route path="/monthly-goals" element={<MonthlyGoals monthlyGoals={data.monthlyGoals} setMonthlyGoals={setMonthlyGoals} showToast={showToast} />} />
            <Route path="/yearly-goals" element={<YearlyGoals yearlyGoals={data.yearlyGoals} setYearlyGoals={setYearlyGoals} showToast={showToast} />} />
            <Route path="/calendar" element={<Calendar dailyGoals={data.dailyGoals} tasks={data.tasks} monthlyGoals={data.monthlyGoals} />} />
            <Route path="/search" element={<Search dailyGoals={data.dailyGoals} tasks={data.tasks} monthlyGoals={data.monthlyGoals} yearlyGoals={data.yearlyGoals} />} />
            <Route path="/settings" element={<Settings data={data} setData={setData} saveData={(nextData) => saveAppData(nextData)} showToast={showToast} />} />
            <Route path="/statistics" element={<Statistics habits={data.dailyGoals} goals={data.yearlyGoals} tasks={data.tasks} />} />
            <Route path="/achievements" element={<Achievements dailyGoals={data.dailyGoals} achievements={data.achievements || []} setAchievements={setAchievements} />} />
          </Routes>
        </section>
      </main>
      <Fab onClick={() => setQuickAddOpen(true)} />
      <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onAddDailyGoal={addDailyGoalFromQuickAdd} onAddTask={addTaskFromQuickAdd} showToast={showToast} />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </Router>
  )
}
