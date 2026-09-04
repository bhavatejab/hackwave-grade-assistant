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

let mockReportsStore: ReportSummary[] = [...INITIAL_MOCK_REPORTS]

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
 * Frontend Mock Service API Contract matching backend endpoints:
 * GET /reports
 * GET /reports/{id}
 * GET /reports/student/{uuid}
 * GET /analytics
 * POST /reports/archive
 * POST /reports/restore
 * DELETE /reports
 * GET /student-history
 */
export const reportService = {
  async getReports(filter?: GetReportsFilter): Promise<PaginatedReportsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 150)) // Simulate network latency

    let list = mockReportsStore.filter((r) => r.isArchived === Boolean(filter?.isArchived))

    if (filter?.search) {
      const q = filter.search.toLowerCase()
      list = list.filter(
        (r) =>
          r.assessmentName.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.className.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q) ||
          r.courseCode.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      )
    }

    if (filter?.subject && filter.subject !== 'all') {
      list = list.filter((r) => r.subject.toLowerCase() === filter.subject?.toLowerCase())
    }

    if (filter?.status && filter.status !== 'all') {
      list = list.filter((r) => r.status === filter.status)
    }

    // Sort
    const sortBy = filter?.sortBy || 'date'
    const sortOrder = filter?.sortOrder || 'desc'
    list.sort((a, b) => {
      let valA: any = a.evaluationDate
      let valB: any = b.evaluationDate

      if (sortBy === 'score') {
        valA = a.averageScore
        valB = b.averageScore
      } else if (sortBy === 'confidence') {
        valA = a.averageConfidence
        valB = b.averageConfidence
      } else if (sortBy === 'name') {
        valA = a.assessmentName
        valB = b.assessmentName
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    // Pagination
    const page = filter?.page || 1
    const limit = filter?.limit || 10
    const total = list.length
    const totalPages = Math.ceil(total / limit) || 1
    const startIndex = (page - 1) * limit
    const paginated = list.slice(startIndex, startIndex + limit)

    return {
      reports: paginated,
      total,
      page,
      totalPages,
    }
  },

  async getReportById(id: string): Promise<EvaluationReportDetail | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    const summary = mockReportsStore.find((r) => r.id === id) || mockReportsStore[0]

    return {
      id: summary.id,
      assessmentName: summary.assessmentName,
      subject: summary.subject,
      className: summary.className,
      section: summary.section,
      courseCode: summary.courseCode,
      teacherName: summary.teacherName,
      teacherEmail: `${summary.teacherName.toLowerCase().replace(/[^a-z]/g, '')}@university.edu`,
      evaluationDate: summary.evaluationDate,
      studentCount: summary.studentCount,
      averageMarks: summary.averageScore,
      maximumMarks: summary.maximumMarks,
      averageConfidence: summary.averageConfidence,
      manualReviewsCount: summary.manualReviewsCount,
      teacherOverridesCount: summary.teacherOverridesCount,
      isArchived: summary.isArchived,
      students: MOCK_STUDENTS_LIST,
    }
  },

  async getStudentReport(reportId: string, studentUUID: string): Promise<StudentEvaluationReport | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const student = MOCK_STUDENTS_LIST.find((s) => s.studentUUID === studentUUID) || MOCK_STUDENTS_LIST[0]
    return student
  },

  async getStudentHistory(studentUUID: string): Promise<StudentHistoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    return [
      {
        id: 'HIST-1',
        reportId: 'REP-2026-001',
        assessmentName: 'CS106B Midterm Examination',
        courseCode: 'CS106B',
        subject: 'Computer Science',
        date: '2026-09-02',
        totalMarks: 85,
        maximumMarks: 100,
        confidence: 94,
        teacherReviewed: true,
        finalGrade: 'A',
        overridesCount: 1,
      },
      {
        id: 'HIST-2',
        reportId: 'REP-2026-003',
        assessmentName: 'MATH51 Linear Algebra Midterm',
        courseCode: 'MATH51',
        subject: 'Mathematics',
        date: '2026-08-20',
        totalMarks: 91,
        maximumMarks: 100,
        confidence: 98,
        teacherReviewed: false,
        finalGrade: 'A+',
        overridesCount: 0,
      },
      {
        id: 'HIST-3',
        reportId: 'REP-2026-006',
        assessmentName: 'CS182 Artificial Intelligence Quiz 1',
        courseCode: 'CS182',
        subject: 'Computer Science',
        date: '2026-07-14',
        totalMarks: 44,
        maximumMarks: 50,
        confidence: 96,
        teacherReviewed: true,
        finalGrade: 'A',
        overridesCount: 0,
      },
    ]
  },

  async getAnalytics(): Promise<AnalyticsOverview> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return MOCK_ANALYTICS_DATA
  },

  async archiveReport(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const item = mockReportsStore.find((r) => r.id === id)
    if (item) {
      item.isArchived = true
      item.status = 'archived'
      return true
    }
    return false
  },

  async restoreReport(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const item = mockReportsStore.find((r) => r.id === id)
    if (item) {
      item.isArchived = false
      item.status = 'completed'
      return true
    }
    return false
  },

  async deleteReport(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    mockReportsStore = mockReportsStore.filter((r) => r.id !== id)
    return true
  },
}
