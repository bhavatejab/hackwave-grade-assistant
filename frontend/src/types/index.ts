export type EvaluationStatus = 'auto_graded' | 'pending_review' | 'manual_review' | 'finalized'

export type PriorityLevel = 'high' | 'medium' | 'low'

export interface EvaluationItem {
  id: string
  anonymousStudentId: string // Anonymous UUID format
  courseCode: string
  courseName: string
  submittedAt: string
  confidenceScore: number // percentage e.g. 96
  score: number // percentage or out of 100
  status: EvaluationStatus
  evaluatorName?: string
  flaggedReason?: string
}

export interface ReviewQueueItem {
  id: string
  anonymousStudentId: string
  courseCode: string
  assignmentTitle: string
  submittedAt: string
  confidenceScore: number
  suggestedScore: number
  priority: PriorityLevel
  flagReason: string
}

export interface ActivityItem {
  id: string
  timestamp: string
  type: 'evaluation_completed' | 'manual_review_needed' | 'report_generated' | 'system_alert'
  title: string
  description: string
  anonymousStudentId?: string
}

export interface StatMetric {
  title: string
  value: string | number
  change: string
  isPositive: boolean
  description: string
  iconName: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'danger'
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  institution: string
  avatarUrl: string
}
