import { ApiResponse, GradeRequest, GradeResponse, ChallengeRequest, ChallengeResponse, FeedbackRequest, FeedbackResponse, FinalGradeRequest, FinalGradeResponse, HealthResponse } from '../types/api'
import { apiClient } from './apiClient'

export interface CreateEvaluationPayload {
  assessmentName: string
  subject: string
  className: string
  section: string
  maxMarks: number
  assessmentDate: string
  instructions?: string
}

export interface EvaluationRecord {
  id: string
  assessmentName: string
  subject: string
  className: string
  section: string
  maxMarks: number
  assessmentDate: string
  status: 'draft' | 'staging' | 'processing' | 'completed'
  createdDate: string
}

export interface UploadedFileRecord {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  status: 'uploading' | 'completed' | 'failed'
  progress: number
  anonymousUuid?: string
}

export interface PipelineStage {
  id: string
  name: string
  status: 'completed' | 'processing' | 'waiting'
  duration?: string
}

export interface StudentRecord {
  id: string
  name: string
  rollNumber: string
  uuid: string // Anonymous UUID format e.g. STU-A91F23
  status: 'Evaluated' | 'Pending Verification' | 'Requires Review'
  course: string
}

// Mock API Client for Frontend Services
export const evaluationService = {
  // POST /evaluations
  createEvaluation: async (
    payload: CreateEvaluationPayload
  ): Promise<ApiResponse<EvaluationRecord>> => {
    const response = await apiClient.post<EvaluationRecord>('/api/evaluations', payload)
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // POST /upload/question-paper
  uploadQuestionPaper: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<UploadedFileRecord>('/api/upload/question-paper', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // POST /upload/rubric
  uploadRubric: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<UploadedFileRecord>('/api/upload/rubric', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // POST /upload/student-answer
  uploadStudentAnswer: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<UploadedFileRecord>('/api/upload/student-answer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // GET /evaluation/status
  getEvaluationStatus: async (): Promise<ApiResponse<{
    overallProgress: number
    estimatedTimeSeconds: number
    pipeline: PipelineStage[]
  }>> => {
    const response = await apiClient.get<any>('/api/evaluation/status')
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // GET /students
  getStudents: async (): Promise<ApiResponse<StudentRecord[]>> => {
    const response = await apiClient.get<StudentRecord[]>('/api/students')
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: response.data,
    }
  },

  // ----------------------------------------------------
  // FastAPI Backend Endpoints
  // ----------------------------------------------------

  // GET /health
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health')
    return response.data
  },

  // POST /api/grade
  gradeAnswer: async (payload: GradeRequest): Promise<GradeResponse> => {
    const response = await apiClient.post<GradeResponse>('/api/grade', payload)
    return response.data
  },

  // POST /api/challenge
  challengeCriterion: async (payload: ChallengeRequest): Promise<ChallengeResponse> => {
    const response = await apiClient.post<ChallengeResponse>('/api/challenge', payload)
    return response.data
  },

  // POST /api/feedback
  submitFeedback: async (payload: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await apiClient.post<FeedbackResponse>('/api/feedback', payload)
    return response.data
  },

  // POST /api/final-grade
  submitFinalGrade: async (payload: FinalGradeRequest): Promise<FinalGradeResponse> => {
    const response = await apiClient.post<FinalGradeResponse>('/api/final-grade', payload)
    return response.data
  },
}
