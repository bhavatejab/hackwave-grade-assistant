import { EvaluationItem, ReviewQueueItem, ActivityItem, UserProfile } from './index'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DashboardSummaryResponse {
  totalEvaluations: number
  manualReviewsCount: number
  finalizedReportsCount: number
  avgConfidenceScore: number
  avgOverallScore: number
  autoGradedPercentage: number
  recentEvaluations: EvaluationItem[]
  pendingReviews: ReviewQueueItem[]
  activities: ActivityItem[]
}

// API Endpoints Contract (to be connected to FastAPI backend)
export const API_ENDPOINTS = {
  HEALTH: '/health',
  DASHBOARD_SUMMARY: '/api/v1/dashboard/summary',
  EVALUATIONS: '/api/v1/evaluations',
  REVIEWS: '/api/v1/reviews',
  ANALYTICS: '/api/v1/analytics',
  REPORTS: '/api/v1/reports',
  USERS: '/api/v1/users/me',
} as const
