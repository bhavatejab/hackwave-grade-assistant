import { ApiResponse } from '../types/api'

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
    await new Promise((res) => setTimeout(res, 500))
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: `eval_${Date.now()}`,
        ...payload,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
      },
    }
  },

  // POST /upload/question-paper
  uploadQuestionPaper: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    await new Promise((res) => setTimeout(res, 600))
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: `qp_${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleTimeString(),
        status: 'completed',
        progress: 100,
      },
    }
  },

  // POST /upload/rubric
  uploadRubric: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    await new Promise((res) => setTimeout(res, 600))
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: `rub_${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleTimeString(),
        status: 'completed',
        progress: 100,
      },
    }
  },

  // POST /upload/student-answer
  uploadStudentAnswer: async (file: File): Promise<ApiResponse<UploadedFileRecord>> => {
    await new Promise((res) => setTimeout(res, 400))
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: `ans_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleTimeString(),
        status: 'completed',
        progress: 100,
        anonymousUuid: `STU-${randomHex}`,
      },
    }
  },

  // GET /evaluation/status
  getEvaluationStatus: async (): Promise<ApiResponse<{
    overallProgress: number
    estimatedTimeSeconds: number
    pipeline: PipelineStage[]
  }>> => {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        overallProgress: 45,
        estimatedTimeSeconds: 28,
        pipeline: [
          { id: '1', name: 'Reading Question Paper', status: 'completed', duration: '1.2s' },
          { id: '2', name: 'Reading Answer Key', status: 'completed', duration: '2.1s' },
          { id: '3', name: 'Reading Student Answers', status: 'processing' },
          { id: '4', name: 'Generating Evaluation', status: 'waiting' },
          { id: '5', name: 'Generating Evidence', status: 'waiting' },
          { id: '6', name: 'Calculating Confidence', status: 'waiting' },
          { id: '7', name: 'Preparing Results', status: 'waiting' },
        ],
      },
    }
  },

  // GET /students
  getStudents: async (): Promise<ApiResponse<StudentRecord[]>> => {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: [
        { id: '1', name: 'Alexander Wright', rollNumber: 'CS2026-001', uuid: 'STU-A91F23', status: 'Evaluated', course: 'CS106B' },
        { id: '2', name: 'Beatrice Vance', rollNumber: 'CS2026-002', uuid: 'STU-B88D41', status: 'Evaluated', course: 'CS106B' },
        { id: '3', name: 'Carlos Mendez', rollNumber: 'CS2026-003', uuid: 'STU-C44E90', status: 'Requires Review', course: 'CS182' },
        { id: '4', name: 'Diana Prince', rollNumber: 'CS2026-004', uuid: 'STU-D11F99', status: 'Evaluated', course: 'MATH51' },
        { id: '5', name: 'Ethan Hunt', rollNumber: 'CS2026-005', uuid: 'STU-E77A12', status: 'Pending Verification', course: 'PHYS41' },
        { id: '6', name: 'Fiona Gallagher', rollNumber: 'CS2026-006', uuid: 'STU-F33B88', status: 'Evaluated', course: 'CS106B' },
        { id: '7', name: 'Gabriel Ross', rollNumber: 'CS2026-007', uuid: 'STU-G99C44', status: 'Evaluated', course: 'EE108' },
        { id: '8', name: 'Hannah Abbott', rollNumber: 'CS2026-008', uuid: 'STU-H22D55', status: 'Requires Review', course: 'CS182' },
      ],
    }
  },
}
