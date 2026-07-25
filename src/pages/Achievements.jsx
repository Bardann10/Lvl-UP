import { useEffect, useMemo, useState } from 'react'
import { createId } from '../services/storage'

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

export function Achievements({ dailyGoals, achievements, setAchievements }) {
  const [justUnlocked, setJustUnlocked] = useState([])

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
        nextUnlocked.push({ id: achievement.id, title: achievement.title, description: achievement.description, icon: achievement.icon, unlockedAt: new Date().toISOString() })
      }
    }

    if (nextUnlocked.length > 0) {
      setAchievements((current) => [...current, ...nextUnlocked.filter((item) => !current.some((existing) => existing.id === item.id))])
      setJustUnlocked(nextUnlocked.map((item) => item.id))
    }
  }, [achievements, completedCount, longestStreak, setAchievements])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Achievements</p>
        <h2 className="text-2xl font-semibold text-white">Badges for your consistency</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = (achievements || []).some((item) => item.id === achievement.id)
          const isNew = justUnlocked.includes(achievement.id)
          return (
            <div key={achievement.id} className={`rounded-3xl border p-4 transition ${unlocked ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-slate-900/70'} ${isNew ? 'animate-pulse' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-2 ${unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    <span className="material-symbols-outlined">{achievement.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{achievement.title}</p>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                {unlocked ? <span className="text-sm text-emerald-300">Unlocked</span> : <span className="text-sm text-slate-500">Locked</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
