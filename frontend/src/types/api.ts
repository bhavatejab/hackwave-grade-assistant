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
  GRADE: '/api/grade',
  CHALLENGE: '/api/challenge',
  FEEDBACK: '/api/feedback',
  FINAL_GRADE: '/api/final-grade',
  DASHBOARD_SUMMARY: '/api/v1/dashboard/summary',
  EVALUATIONS: '/api/v1/evaluations',
  REVIEWS: '/api/v1/reviews',
  ANALYTICS: '/api/v1/analytics',
  REPORTS: '/api/v1/reports',
  USERS: '/api/v1/users/me',
} as const

// FastAPI Backend Data Contracts

export interface RubricCriterion {
  id: string
  description: string
  max_score: number
}

export interface GradeRequest {
  question: string
  rubric: RubricCriterion[]
  student_answer: string
  ocr_confidence?: number | null
}

export interface CriterionResult {
  id: string
  score: number
  max_score: number
  reasoning: string
  evidence: string
}

export interface GradeResponse {
  total_score: number
  max_score: number
  criteria: CriterionResult[]
  alternative_reasoning_detected: boolean
  confidence: number
  requires_teacher_review: boolean
  ocr_confidence?: number | null
}

export interface ChallengeRequest {
  question: string
  criterion: RubricCriterion
  student_answer: string
  original_score: number
  original_reasoning: string
  original_evidence: string
  teacher_challenge: string
}

export interface ChallengeResponse {
  criterion_id: string
  original_score: number
  reconsidered_score: number
  max_score: number
  decision: string
  reasoning: string
  evidence: string
  confidence: number
  requires_teacher_review: boolean
}

export interface FeedbackRequest {
  question: string
  criterion_id: string
  student_answer: string
  ai_score: number
  ai_reasoning: string
  ai_evidence: string
  reconsidered_score: number | null
  teacher_final_score: number
  teacher_feedback: string
  feedback_type?: string
}

export interface FeedbackResponse {
  status: string
  message: string
  feedback_id: string
}

export interface FinalGradeCriterion {
  id: string
  score: number
  max_score: number
  reasoning?: string
  evidence?: string
  [key: string]: any
}

export interface FinalGradeRequest {
  criteria: FinalGradeCriterion[]
  criterion_id: string
  teacher_final_score: number
}

export interface FinalGradeResponse {
  total_score: number
  max_score: number
  criteria: FinalGradeCriterion[]
}

export interface HealthResponse {
  status: string
  service: string
}

