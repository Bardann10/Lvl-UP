import { createContext, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timeout)
  }, [toast])

  return (
    <ToastContext.Provider value={{ showToast: setToast }}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-card)] backdrop-blur-xl"
        >
          <span className="material-symbols-outlined text-[18px] text-[var(--color-accent)]">check_circle</span>
          {toast}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
