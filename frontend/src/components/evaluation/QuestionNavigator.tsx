import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ListFilter,
} from 'lucide-react'
import { QuestionEvaluation } from '../../api/mockEvaluationResults'
import { Drawer } from '../ui/Drawer'
import { cn } from '../../utils/cn'

export interface QuestionNavigatorProps {
  questions: QuestionEvaluation[]
  activeQuestionId: string
  onSelectQuestion: (id: string) => void
  className?: string
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  activeQuestionId,
  onSelectQuestion,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const activeItemRef = useRef<HTMLButtonElement | null>(null)
  const listContainerRef = useRef<HTMLDivElement | null>(null)

  const activeIndex = questions.findIndex((q) => q.id === activeQuestionId)
  const activeQuestionNumber = activeIndex >= 0 ? activeIndex + 1 : 1

  // Auto-scroll active navigator item internally inside the list container without jumping the window page
  useEffect(() => {
    if (activeItemRef.current && listContainerRef.current) {
      const container = listContainerRef.current
      const item = activeItemRef.current
      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()

      if (itemRect.top < containerRect.top) {
        container.scrollTop -= (containerRect.top - itemRect.top + 8)
      } else if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += (itemRect.bottom - containerRect.bottom + 8)
      }
    }
  }, [activeQuestionId])

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDot = (q: QuestionEvaluation) => {
    if (q.manualReviewRequired || q.confidence < 75) {
      return <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
    }
    if (q.confidence < 90) {
      return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
    }
    return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
  }

  const renderQuestionList = (isMobile: boolean = false) => (
    <div className="space-y-1.5">
      {filteredQuestions.map((q) => {
        const isActive = q.id === activeQuestionId
        const isLowConfidence = q.manualReviewRequired || q.confidence < 75

        return (
          <button
            key={q.id}
            ref={isActive ? activeItemRef : null}
            onClick={() => {
              onSelectQuestion(q.id)
              if (isMobile) setIsMobileDrawerOpen(false)
            }}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left relative group',
              isActive
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600 shadow-2xs'
                : isLowConfidence
                ? 'border border-red-200/80 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-slate-800 dark:text-slate-200 hover:bg-red-100/50 dark:hover:bg-red-900/30'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getDot(q)}
              <span className="truncate">{q.questionNumber}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'font-mono text-[11px]',
                  isActive
                    ? 'text-blue-700 dark:text-blue-300 font-bold'
                    : q.confidence > 90
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : q.confidence > 75
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400 font-bold'
                )}
              >
                {q.confidence}%
              </span>

              {q.manualReviewRequired && (
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              )}
              {q.isOverridden && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Viewing Question {activeQuestionNumber} of {questions.length}
          </span>
        </div>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm"
        >
          <span>Jump to Q</span>
        </button>
      </div>

      {/* Desktop Sticky Question Navigator Container */}
      <div
        className={cn(
          'hidden md:flex flex-col p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden',
          className
        )}
      >
        {/* Header & Progress Indicator Required by Prompt */}
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Question Navigator
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {questions.length} Questions
            </span>
          </div>

          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono pt-0.5">
            Viewing Question {activeQuestionNumber} of {questions.length}
          </p>
        </div>

        {/* Searchable "Jump to Question" Dropdown / Input Required by Prompt */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Jump to question (e.g. Q4)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Independently Scrollable Question List */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto pr-1">
          {renderQuestionList(false)}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">🟢 &gt;90%</span>
          <span className="flex items-center gap-1">🟡 75-90%</span>
          <span className="flex items-center gap-1 text-red-500 font-bold">🔴 Manual</span>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Drawer / Sheet */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title={`Question Navigator (Viewing Q${activeQuestionNumber} of ${questions.length})`}
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or jump to question..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          {renderQuestionList(true)}
        </div>
      </Drawer>
    </>
  )
}
