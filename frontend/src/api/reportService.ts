import {
  ReportSummary,
  EvaluationReportDetail,
  StudentEvaluationReport,
  StudentHistoryItem,
  AnalyticsOverview,
  INITIAL_MOCK_REPORTS,
  MOCK_STUDENTS_LIST,
  MOCK_ANALYTICS_DATA,
} from './mockReports'
import { apiClient } from '../services/apiClient'

export interface GetReportsFilter {
  search?: string
  subject?: string
  className?: string
  section?: string
  status?: string
  studentUUID?: string
  dateFrom?: string
  dateTo?: string
  isArchived?: boolean
  sortBy?: 'date' | 'score' | 'confidence' | 'name'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedReportsResponse {
  reports: ReportSummary[]
  total: number
  page: number
  totalPages: number
}

/**
 * Report Service — calls real FastAPI backend endpoints.
 * Endpoints:
 *   GET  /api/reports              - paginated list
 *   POST /api/reports              - add finalized report
 *   GET  /api/reports/{id}         - report detail
 *   GET  /api/reports/student/{uuid} - student report
 *   POST /api/reports/archive      - archive
 *   POST /api/reports/restore      - restore
 *   DELETE /api/reports/{id}       - delete
 *   GET  /api/student-history/{uuid} - student history
 *   GET  /api/analytics            - analytics overview
 */
export const reportService = {
  async getReports(filter?: GetReportsFilter): Promise<PaginatedReportsResponse> {
    const params: Record<string, any> = {}
    if (filter?.isArchived !== undefined) params.isArchived = filter.isArchived
    if (filter?.search) params.search = filter.search
    if (filter?.subject) params.subject = filter.subject
    if (filter?.status) params.status = filter.status
    if (filter?.sortBy) params.sortBy = filter.sortBy
    if (filter?.sortOrder) params.sortOrder = filter.sortOrder
    if (filter?.page) params.page = filter.page
    if (filter?.limit) params.limit = filter.limit

    const response = await apiClient.get<PaginatedReportsResponse>('/api/reports', { params })
    return response.data
  },

  async getReportById(id: string): Promise<EvaluationReportDetail | null> {
    const response = await apiClient.get<EvaluationReportDetail>(`/api/reports/${id}`)
    return response.data
  },

  async getStudentReport(reportId: string, studentUUID: string): Promise<StudentEvaluationReport | null> {
    const response = await apiClient.get<StudentEvaluationReport>(`/api/reports/student/${studentUUID}`)
    return response.data
  },

  async getStudentHistory(studentUUID: string): Promise<StudentHistoryItem[]> {
    const response = await apiClient.get<StudentHistoryItem[]>(`/api/student-history/${studentUUID}`)
    return response.data
  },

  async getAnalytics(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>('/api/analytics')
    return response.data
  },

  async addFinalizedReport(report: ReportSummary): Promise<ReportSummary> {
    const response = await apiClient.post<ReportSummary>('/api/reports', report)
    return response.data
  },

  async archiveReport(id: string): Promise<boolean> {
    try {
      await apiClient.post('/api/reports/archive', { id })
      return true
    } catch (e) {
      console.error('[reportService] archiveReport failed', e)
      return false
    }
  },

  async restoreReport(id: string): Promise<boolean> {
    try {
      await apiClient.post('/api/reports/restore', { id })
      return true
    } catch (e) {
      console.error('[reportService] restoreReport failed', e)
      return false
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/reports/${id}`)
      return true
    } catch (e) {
      console.error('[reportService] deleteReport failed', e)
      return false
    }
  },
}

