const STORAGE_KEY = 'lvl-up-data'

export const defaultData = {
  theme: 'dark',
  notificationsEnabled: true,
  achievements: [],
  dailyGoals: [
    {
      id: 'goal-1',
      title: 'Morning stretch',
      category: 'Health',
      notes: 'Five minutes to wake up.',
      reminderTime: '07:00',
      icon: 'self_improvement',
      color: 'sky',
      completedDates: ['2026-07-24'],
      streak: 1,
    },
    {
      id: 'goal-2',
      title: 'Read 20 pages',
      category: 'Learning',
      notes: 'Keep the momentum going.',
      reminderTime: '21:00',
      icon: 'menu_book',
      color: 'violet',
      completedDates: ['2026-07-23', '2026-07-24'],
      streak: 2,
    },
  ],
  tasks: [
    { id: 'task-1', title: 'Plan tomorrow', description: 'Map priorities for the next day', date: '2026-07-25', reminderTime: '20:00', priority: 'High', color: 'amber', completed: false },
    { id: 'task-2', title: 'Review weekly notes', description: 'Summarize wins and blockers', date: '2026-07-24', reminderTime: '', priority: 'Medium', color: 'emerald', completed: true },
  ],
  monthlyGoals: [
    { id: 'monthly-1', title: 'Finish portfolio case study', target: 100, progress: 72, notes: 'Ship the landing page copy.', dueDate: '2026-07-31', completed: false },
    { id: 'monthly-2', title: 'Run 4 times this month', target: 4, progress: 3, notes: 'Keep the routine simple.', dueDate: '2026-07-30', completed: false },
  ],
  yearlyGoals: [
    { id: 'yearly-1', title: 'Learn React patterns', category: 'Development', milestones: ['Build one reusable hook', 'Finish a feature sprint'], progress: 65, notes: 'Use this as the core skill focus.', dueDate: '2026-12-31', completed: false },
    { id: 'yearly-2', title: 'Save 6 months of expenses', category: 'Finance', milestones: ['Open high-yield savings', 'Automate weekly transfers'], progress: 30, notes: 'Start small and stay consistent.', dueDate: '2026-12-31', completed: false },
  ],
}

function normalizeData(data) {
  return {
    theme: data.theme || 'dark',
    notificationsEnabled: data.notificationsEnabled !== false,
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    dailyGoals: Array.isArray(data.dailyGoals)
      ? data.dailyGoals
      : Array.isArray(data.habits)
        ? data.habits
        : defaultData.dailyGoals,
    tasks: Array.isArray(data.tasks) ? data.tasks : defaultData.tasks,
    monthlyGoals: Array.isArray(data.monthlyGoals) ? data.monthlyGoals : defaultData.monthlyGoals,
    yearlyGoals: Array.isArray(data.yearlyGoals) ? data.yearlyGoals : defaultData.yearlyGoals,
  }
}

export function loadAppData() {
  if (typeof window === 'undefined') return defaultData

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData

    return normalizeData(JSON.parse(raw))
  } catch {
    return defaultData
  }
}

export function saveAppData(data) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeData(data)))
}

export function createId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
