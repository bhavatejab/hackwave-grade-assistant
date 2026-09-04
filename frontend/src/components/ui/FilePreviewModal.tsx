import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileImage,
} from 'lucide-react'
import { Button } from './Button'

export interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  fileType: 'image' | 'pdf'
  fileUrl?: string
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileType,
}) => {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4 // Mock PDF total pages

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative z-10 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${
            isFullscreen ? 'fixed inset-2' : 'w-full max-w-4xl h-[80vh]'
          }`}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              {fileType === 'pdf' ? (
                <FileText className="w-5 h-5 text-red-400" />
              ) : (
                <FileImage className="w-5 h-5 text-blue-400" />
              )}
              <div className="truncate max-w-xs sm:max-w-md">
                <h4 className="text-sm font-semibold truncate">{fileName}</h4>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {fileType} Document Preview
                </span>
              </div>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2">
              {fileType === 'image' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="text-slate-300 hover:text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-mono text-slate-400 min-w-[40px] text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="text-slate-300 hover:text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRotate}
                    title="Rotate 90°"
                    className="text-slate-300 hover:text-white ml-1"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </>
              )}

              {fileType === 'pdf' && (
                <div className="flex items-center gap-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="text-slate-300 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-mono text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="text-slate-300 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="text-slate-300 hover:text-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Viewport Area */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/80">
            {fileType === 'image' ? (
              <div
                className="transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
              >
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl text-center space-y-4 shadow-2xl">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <FileImage className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white font-mono">{fileName}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      High-resolution scan preview (Anonymized UUID: STU-A91F23)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    PDF Document - Page {currentPage}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    STU-UUID Verified
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
                  <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse" />
                </div>
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400 italic">
                  [PDF Render Viewport: Document page content preview simulated cleanly for test suite]
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
