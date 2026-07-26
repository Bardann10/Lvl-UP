import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function Layout({ children, theme = 'dark' }) {
  return (
    <div data-theme={theme} className="app-shell">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="app-glow app-glow-start" />
        <div className="app-glow app-glow-end" />
      </div>

      <Header />

      <main className="app-main">
        <Sidebar />
        <section className="min-w-0 flex-1">{children}</section>
      </main>

      <BottomNav />
    </div>
  )
}
