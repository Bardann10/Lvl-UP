import { todayKey } from './date'

function fromDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00Z`)
}

function toDateKey(date) {
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDateKey(dateKey, days) {
  const date = fromDateKey(dateKey)
  date.setUTCDate(date.getUTCDate() + days)
  return toDateKey(date)
}

function getCompletedCountForDate(dateKey, dailyGoals = []) {
  return dailyGoals.filter((goal) => goal.completedDates.includes(dateKey)).length
}

export function getCompletionPercentForDate(dateKey, dailyGoals = []) {
  if (!dailyGoals.length) return 0
  const completedCount = getCompletedCountForDate(dateKey, dailyGoals)
  return Math.round((completedCount / dailyGoals.length) * 100)
}

export function getCalendarDayStatus(dateKey, dailyGoals = []) {
  const today = todayKey()
  if (dateKey > today) return 'none'
  if (dateKey === today) return 'today'

  const completionPercent = getCompletionPercentForDate(dateKey, dailyGoals)
  if (completionPercent === 100) return 'green'
  if (completionPercent === 0) return 'red'
  return 'yellow'
}

export function calculateCurrentStreak(dailyGoals = []) {
  if (!dailyGoals.length) return 0

  const today = todayKey()
  let cursor = shiftDateKey(today, -1)
  let streak = 0

  while (getCompletionPercentForDate(cursor, dailyGoals) === 100) {
    streak += 1
    cursor = shiftDateKey(cursor, -1)
  }

  return streak
}

export function calculatePerfectDays(dailyGoals = []) {
  if (!dailyGoals.length) return 0

  const today = todayKey()
  const trackedDates = new Set()

  dailyGoals.forEach((goal) => {
    goal.completedDates.forEach((dateKey) => {
      if (dateKey < today) trackedDates.add(dateKey)
    })
  })

  let perfectDays = 0
  trackedDates.forEach((dateKey) => {
    if (getCompletionPercentForDate(dateKey, dailyGoals) === 100) perfectDays += 1
  })

  return perfectDays
}

export function calculateBestStreakFromHistory(dailyGoals = []) {
  if (!dailyGoals.length) return 0

  const today = todayKey()
  const trackedDates = new Set()

  dailyGoals.forEach((goal) => {
    goal.completedDates.forEach((dateKey) => {
      if (dateKey < today) trackedDates.add(dateKey)
    })
  })

  const perfectDates = Array.from(trackedDates)
    .filter((dateKey) => getCompletionPercentForDate(dateKey, dailyGoals) === 100)
    .sort()

  if (perfectDates.length === 0) return 0

  let best = 0
  let run = 0
  let previousDateKey = null

  perfectDates.forEach((dateKey) => {
    if (previousDateKey && shiftDateKey(previousDateKey, 1) === dateKey) {
      run += 1
    } else {
      run = 1
    }

    if (run > best) best = run
    previousDateKey = dateKey
  })

  return best
}