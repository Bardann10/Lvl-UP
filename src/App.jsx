import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { ToastProvider, useToast } from './shared/providers/ToastProvider'
import { Fab } from './shared/ui/Fab'
import { QuickAddModal } from './features/quickAdd/QuickAddModal'
import { ROUTES } from './app/router'
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
import { defaultData, loadAppData, saveAppData } from './services/storage'

function AppShell() {
  const { showToast } = useToast()
  const [data, setData] = useState(defaultData)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  useEffect(() => {
    const loaded = loadAppData()
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <Layout theme={data.theme}>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Dashboard
              dailyGoals={data.dailyGoals}
              tasks={data.tasks}
              monthlyGoals={data.monthlyGoals}
              yearlyGoals={data.yearlyGoals}
              achievements={data.achievements || []}
              setAchievements={setAchievements}
            />
          }
        />
        <Route
          path={ROUTES.DAILY_GOALS}
          element={
            <DailyTargets
              dailyGoals={data.dailyGoals}
              tasks={data.tasks}
              setDailyGoals={setDailyGoals}
              setTasks={setTasks}
              showToast={showToast}
            />
          }
        />
        <Route
          path={ROUTES.MONTHLY_GOALS}
          element={<MonthlyGoals monthlyGoals={data.monthlyGoals} setMonthlyGoals={setMonthlyGoals} showToast={showToast} />}
        />
        <Route
          path={ROUTES.YEARLY_GOALS}
          element={<YearlyGoals yearlyGoals={data.yearlyGoals} setYearlyGoals={setYearlyGoals} showToast={showToast} />}
        />
        <Route
          path={ROUTES.CALENDAR}
          element={<Calendar dailyGoals={data.dailyGoals} tasks={data.tasks} />}
        />
        <Route
          path={ROUTES.SEARCH}
          element={
            <Search
              dailyGoals={data.dailyGoals}
              tasks={data.tasks}
              monthlyGoals={data.monthlyGoals}
              yearlyGoals={data.yearlyGoals}
            />
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <Settings
              data={data}
              setData={setData}
              saveData={(nextData) => saveAppData(nextData)}
              showToast={showToast}
            />
          }
        />
        <Route
          path={ROUTES.STATISTICS}
          element={
            <Statistics
              goals={data.monthlyGoals}
              habits={data.dailyGoals}
              tasks={data.tasks}
            />
          }
        />
        <Route
          path={ROUTES.ACHIEVEMENTS}
          element={
            <Achievements
              dailyGoals={data.dailyGoals}
              achievements={data.achievements || []}
              setAchievements={setAchievements}
            />
          }
        />
        <Route
          path={ROUTES.TODO_TASKS}
          element={<ToDoTasks tasks={data.tasks} setTasks={setTasks} showToast={showToast} />}
        />
      </Routes>

      <Fab onClick={() => setQuickAddOpen(true)} />
      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAddDailyGoal={addDailyGoalFromQuickAdd}
        onAddTask={addTaskFromQuickAdd}
        showToast={showToast}
      />
    </Layout>
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

