import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'

// Lazy-loaded page components for optimal production performance & code splitting
const DashboardHome = lazy(() => import('../pages/DashboardHome').then((m) => ({ default: m.DashboardHome })))
const NewEvaluationPage = lazy(() => import('../pages/NewEvaluationPage').then((m) => ({ default: m.NewEvaluationPage })))
const UploadWorkflowPage = lazy(() => import('../pages/UploadWorkflowPage').then((m) => ({ default: m.UploadWorkflowPage })))
const EvaluationProgressPage = lazy(() => import('../pages/EvaluationProgressPage').then((m) => ({ default: m.EvaluationProgressPage })))
const EvaluationSuccessPage = lazy(() => import('../pages/EvaluationSuccessPage').then((m) => ({ default: m.EvaluationSuccessPage })))
const EvaluationResultsPage = lazy(() => import('../pages/EvaluationResultsPage').then((m) => ({ default: m.EvaluationResultsPage })))
const TeacherReviewPage = lazy(() => import('../pages/TeacherReviewPage').then((m) => ({ default: m.TeacherReviewPage })))
const ManualReviewPage = lazy(() => import('../pages/ManualReviewPage').then((m) => ({ default: m.ManualReviewPage })))
const EvaluationHistoryPage = lazy(() => import('../pages/EvaluationHistoryPage').then((m) => ({ default: m.EvaluationHistoryPage })))
const EvaluationReportPage = lazy(() => import('../pages/EvaluationReportPage').then((m) => ({ default: m.EvaluationReportPage })))
const StudentReportPage = lazy(() => import('../pages/StudentReportPage').then((m) => ({ default: m.StudentReportPage })))
const ArchivedReportsPage = lazy(() => import('../pages/ArchivedReportsPage').then((m) => ({ default: m.ArchivedReportsPage })))
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))
const StudentsPage = lazy(() => import('../pages/StudentsPage').then((m) => ({ default: m.StudentsPage })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const HelpPage = lazy(() => import('../pages/HelpPage').then((m) => ({ default: m.HelpPage })))
const EmptyStatesPage = lazy(() => import('../pages/EmptyStatesPage').then((m) => ({ default: m.EmptyStatesPage })))
const ErrorStatesPage = lazy(() => import('../pages/ErrorStatesPage').then((m) => ({ default: m.ErrorStatesPage })))

const LoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
    <div className="w-8 h-8 border-3 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
      Loading Enterprise Workspace...
    </span>
  </div>
)

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/evaluations/new" element={<NewEvaluationPage />} />
          <Route path="/evaluations/upload" element={<UploadWorkflowPage />} />
          <Route path="/evaluations/progress" element={<EvaluationProgressPage />} />
          <Route path="/evaluations/success" element={<EvaluationSuccessPage />} />
          <Route path="/evaluations/results" element={<EvaluationResultsPage />} />
          <Route path="/evaluations/results/:evaluationId" element={<EvaluationResultsPage />} />
          <Route path="/evaluation-results/:evaluationId" element={<EvaluationResultsPage />} />
          <Route path="/evaluations/review" element={<TeacherReviewPage />} />
          <Route path="/uploads" element={<UploadWorkflowPage />} />
          <Route path="/manual-review" element={<ManualReviewPage />} />
          <Route path="/history" element={<EvaluationHistoryPage />} />
          <Route path="/reports" element={<EvaluationHistoryPage />} />
          <Route path="/reports/:id" element={<EvaluationReportPage />} />
          <Route path="/reports/:id/student/:uuid" element={<StudentReportPage />} />
          <Route path="/archived" element={<ArchivedReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/demo/empty" element={<EmptyStatesPage />} />
          <Route path="/demo/errors" element={<ErrorStatesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
