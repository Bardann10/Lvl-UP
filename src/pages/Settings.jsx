import { useState } from 'react'
import { Button } from '../shared/ui/Button'
import { PageHeader } from '../shared/ui/PageHeader'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { PlannerTextarea } from '../shared/ui/PlannerField'

export function Settings({ data, setData, saveData, showToast }) {
  const [importText, setImportText] = useState('')
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)

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

  const handleConfirmReset = () => {
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
    setConfirmResetOpen(false)
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Settings"
        title="Personalize and protect your data"
        subtitle="Every control follows the same premium design language without changing how the planner works."
      />

      <div className="grid gap-4">
        <div className="app-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Appearance</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">Switch between refined dark and bright studio themes.</p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleTheme}>
              {data.theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </Button>
          </div>
        </div>

        <div className="app-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Notifications</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">Prepare reminders for habits and tasks while keeping the planner logic unchanged.</p>
            </div>
            <Button type="button" variant="secondary" onClick={toggleNotifications}>
              {data.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>

        <div className="app-panel p-5 sm:p-6">
          <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Backup</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">Export a snapshot or paste saved JSON to restore your workspace.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={exportBackup}>
              Export backup
            </Button>
            <Button type="button" variant="secondary" onClick={importBackup}>
              Import backup
            </Button>
          </div>
          <PlannerTextarea
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            className="mt-4 min-h-36 w-full"
            placeholder="Paste exported JSON here"
          />
        </div>

        <div className="app-panel p-5 sm:p-6">
          <div className="rounded-[calc(var(--radius-card)-0.15rem)] border border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)] p-5">
            <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">Reset app</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-tertiary)]">This clears current data from local storage and cannot be undone.</p>
            <div className="mt-5">
              <Button type="button" variant="danger" onClick={() => setConfirmResetOpen(true)}>
                Reset app
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmResetOpen}
        title="Reset all app data?"
        description="This will permanently clear all your goals, tasks, and achievements from local storage. This action cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        danger
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  )
}
