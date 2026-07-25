export function scheduleReminder(reminder, type = 'goal') {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    new Notification(`${type === 'task' ? 'To-Do Task' : 'Daily Goal'} reminder`, {
      body: reminder,
    })
    return true
  }

  if (Notification.permission !== 'denied') {
    Notification.requestPermission().catch(() => {})
  }

  return false
}
