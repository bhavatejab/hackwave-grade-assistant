import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Users, ShieldCheck, FileCheck, ArrowRight, LayoutDashboard } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/dashboard/StatCard'
import { PrivacyCard } from '../components/ui/PrivacyCard'

import { useEvaluation } from '../contexts/EvaluationContext'

export const EvaluationSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation } = useEvaluation()

  const overallPercentage = Math.round((evaluation.overallScore / evaluation.maximumMarks) * 100)

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Animated Success Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="p-8 rounded-3xl bg-emerald-600 text-white dark:bg-emerald-700 shadow-xl border border-emerald-500 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto border border-white/30 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Evaluation Completed!</h1>
        <p className="text-sm text-emerald-100 max-w-md mx-auto leading-relaxed">
          All student answer sheets have been processed and scored against the rubric ({evaluation.maximumMarks} Max Marks) using anonymous UUID anonymization.
        </p>
      </motion.div>

      <PrivacyCard />

      {/* Summary Metrics required by prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Overall Score"
          value={`${evaluation.overallScore} / ${evaluation.maximumMarks}`}
          change={`${overallPercentage}% Mean`}
          isPositive={true}
          description="Average student marks"
          iconName="score"
        />
        <StatCard
          title="Average Confidence"
          value={`${evaluation.overallConfidence}%`}
          change="+2.4%"
          isPositive={true}
          description="High confidence threshold"
          iconName="confidence"
        />
        <StatCard
          title="Questions Evaluated"
          value={evaluation.questionsEvaluated}
          change="Full Paper"
          isPositive={true}
          description="Complete exam rubric coverage"
          iconName="reports"
        />
      </div>

      {/* Action Buttons required by prompt */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/')}
          leftIcon={<LayoutDashboard className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/evaluations/results')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Detailed Evaluation Results
        </Button>
      </div>
    </div>
  )
}
