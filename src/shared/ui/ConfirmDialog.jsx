import { Modal } from './Modal'
import { Button } from './Button'

/**
 * ConfirmDialog – accessible confirmation modal.
 * Replaces `window.confirm` with a styled, keyboard-friendly dialog.
 *
 * @param {boolean}  open          - Controls visibility.
 * @param {string}   title         - Dialog heading.
 * @param {string}   description   - Supporting body text.
 * @param {string}   confirmLabel  - Label for the confirm action (default: "Confirm").
 * @param {string}   cancelLabel   - Label for the cancel action (default: "Cancel").
 * @param {boolean}  danger        - When true, styles the confirm button as destructive.
 * @param {Function} onConfirm     - Called when the user confirms.
 * @param {Function} onCancel      - Called when the user cancels or closes.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          variant={danger ? 'danger' : 'primary'}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
