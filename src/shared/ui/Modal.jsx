import { useEffect, useRef } from 'react'

/**
 * Modal – accessible, focusable dialog overlay.
 *
 * - Traps focus within the dialog.
 * - Closes on ESC key or backdrop click.
 * - Returns focus to the triggering element on close.
 * - Renders bottom-sheet on mobile, centred on desktop.
 */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl' }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement

    // Move focus into the dialog
    const firstFocusable = dialogRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (event.key === 'Tab') {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((el) => !el.disabled)

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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-slate-950/40`}
      >
        {children}
      </div>
    </div>
  )
}
