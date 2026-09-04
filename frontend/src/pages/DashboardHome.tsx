import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { PrivacyBadge } from '../components/ui/PrivacyBadge'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentEvaluations } from '../components/dashboard/RecentEvaluations'
import { PendingReviews } from '../components/dashboard/PendingReviews'
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed'
import { ChartPlaceholder } from '../components/ui/ChartPlaceholder'
import { Button } from '../components/ui/Button'
import { UploadCard } from '../components/ui/UploadCard'
import { Dialog } from '../components/ui/Dialog'
import { Drawer } from '../components/ui/Drawer'
import { MOCK_EVALUATIONS, MOCK_REVIEWS, MOCK_ACTIVITIES } from '../constants/mockData'

export const DashboardHome: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const selectedReview = MOCK_REVIEWS.find((r) => r.id === selectedReviewId)

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Evaluation Command Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              v1.0 API Ready
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional overview of automated grading confidence and human verification queue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="md"
            isLoading={isRefreshing}
            onClick={handleRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Sync Backend
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Evaluation Batch
          </Button>
        </div>
      </div>

      {/* FERPA Anonymous Privacy Badge Component Requirement */}
      <PrivacyBadge variant="banner" />

      {/* Key Metric Statistics Cards (6 required metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Evaluations"
          value="1,428"
          change="+14.2%"
          isPositive={true}
          description="Submissions evaluated across active courses"
          iconName="total"
        />
        <StatCard
          title="Manual Reviews"
          value="18"
          change="-4.5%"
          isPositive={true}
          description="Flagged submissions requiring human evaluator check"
          iconName="reviews"
        />
        <StatCard
          title="Finalized Reports"
          value="1,390"
          change="+12.8%"
          isPositive={true}
          description="Verified grade sheets exported to registrar"
          iconName="reports"
        />
        <StatCard
          title="Average Confidence"
          value="96.4%"
          change="+2.1%"
          isPositive={true}
          description="Backend model decision confidence threshold"
          iconName="confidence"
        />
        <StatCard
          title="Average Score"
          value="88.2%"
          change="+1.8%"
          isPositive={true}
          description="Cumulative grade point average across exams"
          iconName="score"
        />
        <StatCard
          title="Auto-Graded Papers"
          value="98.7%"
          change="+0.9%"
          isPositive={true}
          description="High confidence papers processed without manual review"
          iconName="auto"
        />
      </div>

      {/* Analytics Preview & Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartPlaceholder
            title="Grade Distribution & Confidence Curve"
            subtitle="Statistical grade clustering across active computer science and STEM courses"
            type="bar"
          />
        </div>
        <div>
          <RecentActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <RecentEvaluations evaluations={MOCK_EVALUATIONS} />

      {/* Pending Reviews Queue */}
      <PendingReviews
        reviews={MOCK_REVIEWS}
        onReviewClick={(id) => setSelectedReviewId(id)}
      />

      {/* Dialog for Uploading New Submissions */}
      <Dialog
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Student Exam Submissions"
        description="Select answer sheets or scan batches. Submissions are instantly assigned secure UUIDs."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <UploadCard />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsUploadModalOpen(false)}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Staging
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Drawer for Inspecting Review Detail */}
      <Drawer
        isOpen={Boolean(selectedReviewId)}
        onClose={() => setSelectedReviewId(null)}
        title={`Review Detail: ${selectedReview?.anonymousStudentId || ''}`}
      >
        {selectedReview && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300">
                Flag Reason: {selectedReview.flagReason}
              </span>
              <p className="text-amber-700 dark:text-amber-400">
                Backend API confidence returned {selectedReview.confidenceScore}%. Requires manual confirmation.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Course Code</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedReview.courseCode}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assignment</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedReview.assignmentTitle}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Suggested Score</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedReview.suggestedScore}%
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setSelectedReviewId(null)}
              >
                Approve Suggested Score ({selectedReview.suggestedScore}%)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedReviewId(null)}
              >
                Override Score
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
