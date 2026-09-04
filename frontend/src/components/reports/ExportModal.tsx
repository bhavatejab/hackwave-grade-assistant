import React, { useState } from 'react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Download, FileText, Table as TableIcon, FileCode, CheckCircle2 } from 'lucide-react'

export interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentName?: string
  onExportComplete: (format: string, scope: string) => void
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  assessmentName = 'CS106B Midterm Examination',
  onExportComplete,
}) => {
  const [scope, setScope] = useState<'entire' | 'single' | 'selected' | 'question' | 'analytics'>('entire')
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf')
  const [isExporting, setIsExporting] = useState(false)

  const handleConfirmExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      onExportComplete(format.toUpperCase(), scope)
      onClose()
    }, 500)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Export Evaluation Report"
      description={`Choose export scope & format for ${assessmentName}`}
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
        {/* Scope Selection */}
        <div className="space-y-2">
          <label className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
            Export Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'entire', label: 'Entire Assessment', desc: 'All student submissions & breakdown' },
              { id: 'single', label: 'Single Student', desc: 'Detailed report for selected UUID' },
              { id: 'selected', label: 'Selected Students', desc: 'Filtered batch of student reports' },
              { id: 'question', label: 'Question Breakdown Report', desc: 'Per-question statistical summary' },
              { id: 'analytics', label: 'Analytics Dashboard', desc: 'Institutional chart & metric exports' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScope(item.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === item.id
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{item.label}</span>
                  {scope === item.id && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Printable document' },
              { id: 'csv', label: 'CSV Spreadsheet', icon: TableIcon, desc: 'Raw analytics data' },
              { id: 'excel', label: 'Excel (.xlsx)', icon: FileCode, desc: 'Multi-sheet workbook' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    format === item.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold">{item.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isExporting}
            onClick={handleConfirmExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download {format.toUpperCase()} Report
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
