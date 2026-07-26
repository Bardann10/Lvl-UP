import { Modal } from './Modal'
import { Button } from './Button'

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
      <div className="app-icon-badge h-12 w-12">
        <span className="material-symbols-outlined text-[22px]">warning</span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-6 text-[var(--color-text-tertiary)]">{description}</p> : null}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="button" onClick={onConfirm} variant={danger ? 'danger' : 'primary'}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
