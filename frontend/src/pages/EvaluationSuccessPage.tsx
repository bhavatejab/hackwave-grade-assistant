import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Users, ShieldCheck, FileCheck, ArrowRight, LayoutDashboard } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/dashboard/StatCard'
import { PrivacyCard } from '../components/ui/PrivacyCard'

export const EvaluationSuccessPage: React.FC = () => {
  const navigate = useNavigate()

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
          All student answer sheets have been processed and scored against the rubric using anonymous UUID anonymization.
        </p>
      </motion.div>

      <PrivacyCard />

      {/* Summary Metrics required by prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Students Processed"
          value="48"
          change="100% Batch"
          isPositive={true}
          description="All submissions mapped to STU-UUIDs"
          iconName="total"
        />
        <StatCard
          title="Average Confidence"
          value="96.8%"
          change="+2.4%"
          isPositive={true}
          description="High confidence auto-evaluation threshold"
          iconName="confidence"
        />
        <StatCard
          title="Questions Evaluated"
          value="10"
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
          onClick={() => navigate('/')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Detailed Evaluation Results
        </Button>
      </div>
    </div>
  )
}
