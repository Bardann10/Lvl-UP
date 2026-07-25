import { useState } from 'react'
import { Button } from '../components/Buttons'

export function Settings({ data, setData, saveData, showToast }) {
  const [importText, setImportText] = useState('')

  const toggleTheme = () => {
    const nextTheme = data.theme === 'dark' ? 'light' : 'dark'
    const nextData = { ...data, theme: nextTheme }
    setData(nextData)
    saveData(nextData)
    showToast('Theme updated')
  }

  const toggleNotifications = () => {
    const nextData = { ...data, notificationsEnabled: !data.notificationsEnabled }
    setData(nextData)
    saveData(nextData)
    showToast(data.notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled')
  }

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lvl-up-backup.json'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Backup exported')
  }

  const importBackup = () => {
    try {
      const parsed = JSON.parse(importText)
      const nextData = { ...data, ...parsed }
      setData(nextData)
      saveData(nextData)
      showToast('Backup imported')
      setImportText('')
    } catch {
      showToast('Invalid backup file')
    }
  }

  const resetApp = () => {
    if (window.confirm('Reset all app data?')) {
      const emptyData = {
        theme: data.theme,
        notificationsEnabled: data.notificationsEnabled,
        achievements: [],
        dailyGoals: [],
        tasks: [],
        monthlyGoals: [],
        yearlyGoals: [],
      }
      setData(emptyData)
      saveData(emptyData)
      showToast('App reset')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Settings</p>
        <h2 className="text-2xl font-semibold text-white">Personalize and protect your data</h2>
      </div>

      <div className="grid gap-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Dark mode</p>
              <p className="text-sm text-slate-400">Switch between dark and light preference</p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleTheme}>{data.theme === 'dark' ? 'Dark' : 'Light'}</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Notifications</p>
              <p className="text-sm text-slate-400">Prepare reminder scheduling for goals and tasks</p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleNotifications}>{data.notificationsEnabled ? 'Enabled' : 'Disabled'}</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-lg font-semibold text-white">Backup</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button type="button" onClick={exportBackup}>Export backup</Button>
            <Button type="button" variant="secondary" onClick={importBackup}>Import backup</Button>
          </div>
          <textarea value={importText} onChange={(event) => setImportText(event.target.value)} className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white" placeholder="Paste exported JSON here" />
        </div>

        <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4">
          <p className="text-lg font-semibold text-white">Reset app</p>
          <p className="mt-2 text-sm text-slate-400">This clears current data from local storage.</p>
          <div className="mt-4">
            <Button type="button" variant="ghost" onClick={resetApp}>Reset app</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
