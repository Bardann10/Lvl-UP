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
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-xl"
        >
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
