import { TriangleAlert, X } from 'lucide-react'

export function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }: { title: string; message: string; confirmLabel: string; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button type="button" className="admin-dialog__backdrop" onClick={onCancel} aria-label="Cancel" />
      <div className="admin-dialog__panel"><button type="button" className="admin-dialog__close" onClick={onCancel} aria-label="Close"><X /></button><span className="admin-dialog__warning"><TriangleAlert size={25} /></span><h2 id="confirm-title">{title}</h2><p>{message}</p><div className="admin-dialog__actions"><button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button><button type="button" className="admin-danger-button" disabled={busy} onClick={onConfirm}>{busy ? 'Working…' : confirmLabel}</button></div></div>
    </div>
  )
}
