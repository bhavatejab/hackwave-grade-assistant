import React, { useState } from 'react'
import { Upload, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'
import { PrivacyBadge } from './PrivacyBadge'

export interface UploadCardProps {
  onUploadSimulated?: (files: File[]) => void
  title?: string
  description?: string
  className?: string
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title = 'Upload Student Exam Submissions',
  description = 'Drag & drop PDF answer sheets, scans, or handwritten submissions. Files are automatically anonymized before processing.',
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name)
      setUploadedFiles((prev) => [...prev, ...names])
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-dashed transition-all p-8 text-center bg-white dark:bg-slate-900',
        isDragOver
          ? 'border-green-600 bg-green-50/50 dark:bg-green-950/20 shadow-lg'
          : 'border-green-500/60 hover:border-green-600 dark:border-green-800/80',
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const names = Array.from(e.dataTransfer.files).map((f) => f.name)
          setUploadedFiles((prev) => [...prev, ...names])
        }
      }}
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/50 text-[#22C55E] dark:text-green-400 flex items-center justify-center mb-4 border border-green-100 dark:border-green-900/50 shadow-inner">
        <Upload className="w-7 h-7" />
      </div>

      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <label className="cursor-pointer">
          <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
            Browse PDF Submissions
          </Button>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <span className="text-xs text-slate-400 font-medium">Supports PDF, PNG, JPEG up to 50MB</span>
      </div>

      <div className="max-w-lg mx-auto">
        <PrivacyBadge variant="banner" />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left max-w-lg mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Staged Submissions ({uploadedFiles.length})
          </p>
          {uploadedFiles.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate font-mono">{name}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Staged
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
