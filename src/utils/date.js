export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getTodayLabel() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function formatLongDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function isPastDate(value) {
  if (!value) return false
  const target = new Date(value)
  const today = new Date(todayKey())
  return target < today
}

export function getCompletedHabitsByDate(habits) {
  const entries = habits.flatMap((habit) =>
    habit.completedDates.map((date) => ({ date, title: habit.title })),
  )

  return entries.reduce((acc, entry) => {
    acc[entry.date] = acc[entry.date] || []
    acc[entry.date].push(entry.title)
    return acc
  }, {})
}
