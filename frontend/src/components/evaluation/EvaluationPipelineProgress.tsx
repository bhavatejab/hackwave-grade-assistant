import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Clock, ShieldCheck } from 'lucide-react'
import { ProgressBar } from '../ui/ProgressBar'

export interface PipelineStep {
  name: string
  status: 'completed' | 'processing' | 'waiting'
}

export interface EvaluationPipelineProgressProps {
  progressPercentage: number
  estimatedTimeSeconds: number
  steps: PipelineStep[]
}

export const EvaluationPipelineProgress: React.FC<EvaluationPipelineProgressProps> = ({
  progressPercentage,
  estimatedTimeSeconds,
  steps,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Circular & Horizontal Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Circular Progress Gauge */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-100 dark:text-slate-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="text-blue-600 dark:text-blue-500 stroke-current"
                strokeWidth="10"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * progressPercentage) / 100 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {progressPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Overall
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pipeline Execution Active
          </p>
        </div>

        {/* Remaining Time & Progress Summary */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Evaluation Batch Processing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mock backend API pipeline execution in progress
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <Clock className="w-3.5 h-3.5" />
              <span>Est. ~{estimatedTimeSeconds}s remaining</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <ProgressBar value={progressPercentage} height="lg" variant="primary" />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Stage 3 of 7 Active</span>
              <span>{progressPercentage}% Complete</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Student UUID Anonymization Stream Active</span>
            </div>
            <span className="font-mono text-emerald-500 font-bold">FERPA OK</span>
          </div>
        </div>
      </div>

      {/* Animated Pipeline Stages Timeline */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Evaluation Pipeline Stages
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                {step.status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                {step.status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                {step.status === 'waiting' && (
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {step.name}
                </span>
                {step.status === 'processing' && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 animate-pulse">
                    Processing...
                  </span>
                )}
              </div>

              <span
                className={`text-xs font-semibold capitalize ${
                  step.status === 'completed'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : step.status === 'processing'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400'
                }`}
              >
                {step.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
