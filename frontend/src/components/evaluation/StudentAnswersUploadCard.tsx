import React, { useState } from 'react'
import { UploadCloud, FileText, Eye, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { UuidBadge } from '../ui/UuidBadge'
import { ProgressBar } from '../ui/ProgressBar'
import { FilePreviewModal } from '../ui/FilePreviewModal'
import { cn } from '../../utils/cn'

export interface StagedStudentFile {
  id: string
  name: string
  size: number
  progress: number
  status: 'uploading' | 'completed' | 'failed'
  uuid: string
}

export interface StudentAnswersUploadCardProps {
  onFilesChange?: (files: StagedStudentFile[]) => void
  className?: string
}

export const StudentAnswersUploadCard: React.FC<StudentAnswersUploadCardProps> = ({
  onFilesChange,
  className,
}) => {
  const [stagedFiles, setStagedFiles] = useState<StagedStudentFile[]>([
    {
      id: 'stg-1',
      name: 'CS106B_Midterm_Batch1_PartA.pdf',
      size: 14200000,
      progress: 100,
      status: 'completed',
      uuid: 'STU-A91F23',
    },
    {
      id: 'stg-2',
      name: 'CS106B_Midterm_Batch1_PartB.pdf',
      size: 18500000,
      progress: 100,
      status: 'completed',
      uuid: 'STU-B88D41',
    },
    {
      id: 'stg-3',
      name: 'Scan_AnswerSheet_Page3.jpg',
      size: 4200000,
      progress: 65,
      status: 'uploading',
      uuid: 'STU-C44E90',
    },
  ])

  const [previewFile, setPreviewFile] = useState<StagedStudentFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleAddFiles = (files: FileList | File[]) => {
    const newItems: StagedStudentFile[] = Array.from(files).map((f, i) => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
      return {
        id: `stg-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        progress: 100,
        status: 'completed',
        uuid: `STU-${hex}`,
      }
    })

    const updated = [...stagedFiles, ...newItems]
    setStagedFiles(updated)
    if (onFilesChange) onFilesChange(updated)
  }

  const handleRetry = (id: string) => {
    setStagedFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'completed', progress: 100 } : item
      )
    )
  }

  const handleRemove = (id: string) => {
    const updated = stagedFiles.filter((f) => f.id !== id)
    setStagedFiles(updated)
    if (onFilesChange) onFilesChange(updated)
  }

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all',
        isDragOver
          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md'
          : 'border-slate-200 dark:border-slate-800',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files) handleAddFiles(e.dataTransfer.files)
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Student Answer Sheets
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Batch upload multiple images & PDFs (Anonymized UUID mapped)
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {stagedFiles.length} Sheets Staged
        </span>
      </div>

      {/* Batch Dropzone */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-3 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag & drop multiple student answer sheets or exam scans
        </p>
        <label className="inline-block cursor-pointer">
          <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-4 h-4" />}>
            Upload Multiple Answer Sheets
          </Button>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Staged Submissions List with UUID Privacy Badges */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Staged Submissions Queue ({stagedFiles.length})
        </h5>

        {stagedFiles.map((file) => (
          <div
            key={file.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 truncate">
              <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="truncate min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {file.name}
                  </span>
                  <UuidBadge uuid={file.uuid} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-slate-400 mt-1">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {file.status === 'uploading' && (
                    <span className="text-blue-500 font-semibold">Uploading {file.progress}%</span>
                  )}
                  {file.status === 'completed' && (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                  {file.status === 'failed' && (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span>
                  )}
                </div>
                {file.status === 'uploading' && (
                  <div className="w-48 mt-1.5">
                    <ProgressBar value={file.progress} height="sm" variant="primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {file.status === 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewFile(file)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Preview
                </Button>
              )}

              {file.status === 'failed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRetry(file.id)}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Retry
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(file.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <FilePreviewModal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          fileName={previewFile.name}
          fileType={previewFile.name.endsWith('.pdf') ? 'pdf' : 'image'}
        />
      )}
    </div>
  )
}
