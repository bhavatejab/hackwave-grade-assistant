import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[52px] px-4 flex items-center justify-between text-base font-medium rounded-2xl border bg-white dark:bg-[#111827] border-slate-200 dark:border-[#334155] text-slate-900 dark:text-[#F8FAFC] hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#22C55E] transition-all cursor-pointer select-none"
      >
        <span className={cn('flex items-center gap-2 truncate whitespace-nowrap text-left flex-1 min-w-0 pr-2 text-base font-medium', !selectedOption && 'text-[#64748B] dark:text-[#94A3B8]')}>
          {selectedOption?.icon}
          <span className="truncate whitespace-nowrap">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn('w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-xl overflow-hidden p-1.5 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full h-[44px] px-4 flex items-center justify-between text-sm rounded-xl transition-colors text-left truncate whitespace-nowrap shrink-0',
                    isSelected
                      ? 'bg-green-50 dark:bg-green-950/40 text-[#22C55E] dark:text-green-400 font-semibold'
                      : 'text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                  )}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    {opt.icon}
                    <div className="truncate flex-1 min-w-0">
                      <div className="truncate whitespace-nowrap">{opt.label}</div>
                      {opt.description && (
                        <div className="text-xs text-slate-400 font-normal truncate">{opt.description}</div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#22C55E] dark:text-green-400 shrink-0 ml-2" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
