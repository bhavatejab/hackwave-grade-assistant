import React, { useState, useEffect } from 'react'
import { StatCard } from '../components/dashboard/StatCard'
import { ChartPlaceholder } from '../components/ui/ChartPlaceholder'
import { PrivacyBadge } from '../components/ui/PrivacyBadge'
import { PermanentStorageBanner } from '../components/reports/PermanentStorageBanner'
import { reportService } from '../api/reportService'
import { AnalyticsOverview } from '../api/mockReports'
import { Button } from '../components/ui/Button'
import { Download } from 'lucide-react'
import { ExportModal } from '../components/reports/ExportModal'
import { useNotifications } from '../contexts/NotificationContext'

export const AnalyticsPage: React.FC = () => {
  const { addNotification } = useNotifications()
  const [data, setData] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6m')
  const [isExportOpen, setIsExportOpen] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      const res = await reportService.getAnalytics()
      setData(res)
      setLoading(false)
    }
    fetchAnalytics()
  }, [timeRange])

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading Institutional Analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Institutional Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated performance distributions, AI accuracy metrics, and difficulty breakdowns across all departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
          >
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Academic Year 2025–2026</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Analytics Report
          </Button>
        </div>
      </div>

      {/* Permanent Storage UX Banner */}
      <PermanentStorageBanner />

      {/* Privacy FERPA Badge */}
      <PrivacyBadge variant="banner" />

      {/* Executive Summary Stat Cards required by prompt (6 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Evaluations"
          value={data.totalEvaluations}
          change="+14.2% YoY"
          isPositive={true}
          description="Graded assessments"
          iconName="total"
        />
        <StatCard
          title="Average Score"
          value={`${data.averageScore}%`}
          change="+1.8% Mean"
          isPositive={true}
          description="Institutional GPA"
          iconName="score"
        />
        <StatCard
          title="Average Confidence"
          value={`${data.averageConfidence}%`}
          change="+2.4% Certainty"
          isPositive={true}
          description="Model decision certainty"
          iconName="confidence"
        />
        <StatCard
          title="Manual Reviews"
          value={data.manualReviewsCount}
          change="Flagged"
          isPositive={false}
          description="Low confidence papers"
          iconName="reviews"
        />
        <StatCard
          title="Teacher Overrides"
          value={data.teacherOverridesCount}
          change="Adjusted"
          isPositive={true}
          description="Score edits"
          iconName="reports"
        />
        <StatCard
          title="Auto Graded Papers"
          value={`${data.autoGradedPercentage}%`}
          change="Zero Intervention"
          isPositive={true}
          description="Hands-free accuracy"
          iconName="auto"
        />
      </div>

      {/* 8 Responsive Placeholder Charts required by prompt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Performance & Accuracy Trends
          </h3>
          <span className="text-xs text-slate-400 font-mono">Updated Real-Time</span>
        </div>

        {/* Row 1: Evaluation Trend (line) & Average Confidence Trend (line) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="1. Evaluation Trend (Volume over Time)"
            subtitle="Monthly student paper evaluation volume across departments"
            type="line"
          />
          <ChartPlaceholder
            title="2. Average Confidence Trend"
            subtitle="Model confidence scores progression over consecutive exam cycles"
            type="line"
          />
        </div>

        {/* Row 2: Average Marks Trend (line) & Subject-wise Performance (bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="3. Average Marks Trend"
            subtitle="Mean student percentage scores tracked over time"
            type="line"
          />
          <ChartPlaceholder
            title="4. Subject-wise Performance"
            subtitle="Average student score distribution by department (CS, Physics, Math, English)"
            type="bar"
          />
        </div>

        {/* Row 3: Manual Review Distribution (donut) & Auto vs Manual Review (bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="5. Manual Review Distribution"
            subtitle="Breakdown of flagged papers by cause (Confidence, Ambiguity, Alternative Derivations)"
            type="donut"
          />
          <ChartPlaceholder
            title="6. Auto vs Manual Review Ratio"
            subtitle="Monthly comparison of 100% auto-graded papers vs teacher manual intervention"
            type="bar"
          />
        </div>

        {/* Row 4: Monthly Evaluations (bar) & Question Difficulty (bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="7. Monthly Evaluations Summary"
            subtitle="Cumulative assessment count logged per calendar month"
            type="bar"
          />
          <ChartPlaceholder
            title="8. Question Difficulty Analysis"
            subtitle="Per-question average score vs maximum marks identifying difficult topics"
            type="bar"
          />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        assessmentName="Institutional Analytics Dashboard"
        onExportComplete={(fmt, scope) => {
          addNotification({
            type: 'success',
            title: 'Analytics Exported',
            message: `${fmt} analytics report (${scope}) downloaded successfully.`,
          })
        }}
      />
    </div>
  )
}
