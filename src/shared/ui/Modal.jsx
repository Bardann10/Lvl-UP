import { useEffect, useRef } from 'react'

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl' }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement
    const firstFocusable = dialogRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => !element.disabled)

        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousFocus?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgb(8_15_30_/_0.72)] p-4 backdrop-blur-md sm:items-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`app-panel-strong app-fade-in w-full ${maxWidth} p-5 sm:p-6`}
      >
        {children}
      </div>
    </div>
  )
}
