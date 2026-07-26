import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function Layout({ children, theme = 'dark' }) {
  return (
    <div data-theme={theme} className="app-shell">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" />
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
