import { useEffect, useMemo } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'

const ACHIEVEMENTS = [
  { id: 'first-goal', title: 'First Goal Completed', description: 'Complete your first daily goal.', threshold: 1, icon: 'emoji_events' },
  { id: 'streak-7', title: '7-Day Streak', description: 'Maintain a streak for 7 days.', threshold: 7, icon: 'bolt' },
  { id: 'streak-30', title: '30-Day Streak', description: 'Maintain a streak for 30 days.', threshold: 30, icon: 'auto_awesome' },
  { id: 'streak-100', title: '100-Day Streak', description: 'Maintain a streak for 100 days.', threshold: 100, icon: 'workspace_premium' },
  { id: 'streak-365', title: '365-Day Streak', description: 'Maintain a streak for 365 days.', threshold: 365, icon: 'military_tech' },
  { id: 'goals-100', title: '100 Goals Completed', description: 'Complete 100 goals in total.', threshold: 100, icon: 'task_alt' },
  { id: 'goals-500', title: '500 Goals Completed', description: 'Complete 500 goals in total.', threshold: 500, icon: 'task_alt' },
  { id: 'goals-1000', title: '1000 Goals Completed', description: 'Complete 1000 goals in total.', threshold: 1000, icon: 'task_alt' },
]

export function Achievements({ dailyGoals, achievements, setAchievements, compact = false }) {
  const completedCount = useMemo(() => dailyGoals.reduce((count, goal) => count + goal.completedDates.length, 0), [dailyGoals])
  const longestStreak = useMemo(() => dailyGoals.reduce((max, goal) => Math.max(max, goal.streak || 0), 0), [dailyGoals])

  useEffect(() => {
    const nextUnlocked = []
    const unlockedMap = new Map((achievements || []).map((item) => [item.id, item]))

    for (const achievement of ACHIEVEMENTS) {
      const isUnlocked = unlockedMap.has(achievement.id)
      if (isUnlocked) continue

      const qualifies =
        (achievement.id === 'first-goal' && completedCount >= 1) ||
        (achievement.id === 'streak-7' && longestStreak >= 7) ||
        (achievement.id === 'streak-30' && longestStreak >= 30) ||
        (achievement.id === 'streak-100' && longestStreak >= 100) ||
        (achievement.id === 'streak-365' && longestStreak >= 365) ||
        (achievement.id === 'goals-100' && completedCount >= 100) ||
        (achievement.id === 'goals-500' && completedCount >= 500) ||
        (achievement.id === 'goals-1000' && completedCount >= 1000)

      if (qualifies) {
        nextUnlocked.push({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlockedAt: new Date().toISOString(),
        })
      }
    }

    if (nextUnlocked.length > 0) {
      setAchievements((current) => [...current, ...nextUnlocked.filter((item) => !current.some((existing) => existing.id === item.id))])
    }
  }, [achievements, completedCount, longestStreak, setAchievements])

  return (
    <div className={compact ? 'space-y-4' : 'page-shell'}>
      <PageHeader
        eyebrow="Achievements"
        title="Badges for your consistency"
        subtitle="Celebrate streaks and milestones with polished cards that feel at home everywhere in the app."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlockedAchievement = (achievements || []).find((item) => item.id === achievement.id)
          const unlocked = Boolean(unlockedAchievement)
          return (
            <div
              key={achievement.id}
              className={`app-list-item p-5 ${unlocked ? 'border-[var(--color-success-soft)] bg-[var(--color-success-soft)]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] ${unlocked ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]'}`}>
                    <span className="material-symbols-outlined text-[22px]">{achievement.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">{achievement.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{achievement.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${unlocked ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
