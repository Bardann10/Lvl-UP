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
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-sky-200/30 bg-slate-900/88 px-4 py-2 text-sm font-medium text-sky-100 shadow-2xl shadow-sky-900/20 backdrop-blur-xl">
          {toast}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
