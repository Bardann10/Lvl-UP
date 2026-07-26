import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

/**
 * Layout – the application shell.
 *
 * Renders the sticky Header, desktop Sidebar, main content area,
 * and the mobile BottomNav. The `theme` prop toggles the global
 * light/dark surface colour.
 */
export function Layout({ children, theme = 'dark' }) {
  const themeClass =
    theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <Header />

      <main className="mx-auto flex max-w-6xl gap-6 px-3 pb-24 pt-6 sm:px-4 lg:px-6 lg:pb-6">
        <Sidebar />
        <section className="min-w-0 flex-1">{children}</section>
      </main>

      <BottomNav />
    </div>
  )
}
