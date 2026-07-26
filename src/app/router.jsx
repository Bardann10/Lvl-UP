/**
 * Centralised route configuration.
 * Import ROUTES for type-safe path references and NAV_ITEMS for navigation components.
 */
export const ROUTES = {
  HOME: '/',
  DAILY_GOALS: '/daily-goals',
  MONTHLY_GOALS: '/monthly-goals',
  YEARLY_GOALS: '/yearly-goals',
  CALENDAR: '/calendar',
  SEARCH: '/search',
  SETTINGS: '/settings',
  STATISTICS: '/statistics',
  ACHIEVEMENTS: '/achievements',
  TODO_TASKS: '/to-do-tasks',
}

/** Navigation items shown in the Sidebar (desktop) and BottomNav (mobile). */
export const NAV_ITEMS = [
  { to: ROUTES.HOME, label: 'Dashboard', icon: 'home' },
  { to: ROUTES.DAILY_GOALS, label: 'Daily Goals', icon: 'track_changes' },
  { to: ROUTES.MONTHLY_GOALS, label: 'Monthly Goals', icon: 'insights' },
  { to: ROUTES.YEARLY_GOALS, label: 'Yearly Goals', icon: 'military_tech' },
  { to: ROUTES.CALENDAR, label: 'Calendar', icon: 'calendar_month' },
]
