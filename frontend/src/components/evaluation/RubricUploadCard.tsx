import React, { useState } from 'react'
import { BookOpen, Upload, Eye, RefreshCw, Trash2, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { FilePreviewModal } from '../ui/FilePreviewModal'
import { cn } from '../../utils/cn'

export interface RubricUploadCardProps {
  onFileSelect?: (file: File | null) => void
  className?: string
}

export const RubricUploadCard: React.FC<RubricUploadCardProps> = ({
  onFileSelect,
  className,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFile = (file: File) => {
    setSelectedFile(file)
    if (onFileSelect) onFileSelect(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    if (onFileSelect) onFileSelect(null)
  }

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all',
        isDragOver
          ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-md'
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0])
        }
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/50">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Answer Key & Grading Rubric
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload solution key or grading breakdown
            </p>
          </div>
        </div>

        {selectedFile && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Rubric Staged
          </span>
        )}
      </div>

      {/* Prominent Prompt Requirement Text */}
      <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 mb-4 flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 font-medium">
        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
        <span>Handwritten and printed answer keys are supported.</span>
      </div>

      {!selectedFile ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag & drop handwritten or printed answer key PDF/Images here
          </p>
          <label className="inline-block cursor-pointer">
            <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
              Browse Rubric / Answer Key
            </Button>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <BookOpen className="w-5 h-5 text-purple-500 shrink-0" />
            <div className="truncate text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Preview
            </Button>

            <label className="cursor-pointer">
              <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Replace
              </Button>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {selectedFile && (
        <FilePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileName={selectedFile.name}
          fileType={selectedFile.name.endsWith('.pdf') ? 'pdf' : 'image'}
        />
      )}
    </div>
  )
}
