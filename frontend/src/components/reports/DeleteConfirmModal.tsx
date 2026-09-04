import React from 'react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { AlertTriangle, Trash2, Archive } from 'lucide-react'

export interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  isPermanent?: boolean
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Evaluation Report',
  description = 'Are you sure you want to delete this evaluation report? This action can be undone by restoring from Archived Reports.',
  confirmText = 'Confirm Action',
  isPermanent = false,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-5 text-xs">
        <div className="flex items-start gap-4 p-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/60">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {description}
            </p>
            {isPermanent && (
              <p className="text-[11px] text-red-600 dark:text-red-400 font-bold">
                Warning: Permanent deletion will remove all associated student records and audit trails permanently.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            leftIcon={isPermanent ? <Trash2 className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
