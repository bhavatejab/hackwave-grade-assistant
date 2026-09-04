import { QuestionEvaluation, MOCK_EVALUATION_RESULT } from './mockEvaluationResults'

export interface ReportSummary {
  id: string
  assessmentName: string
  subject: string
  className: string
  section: string
  evaluationDate: string
  studentCount: number
  averageScore: number
  averageConfidence: number
  manualReviewsCount: number
  teacherOverridesCount: number
  status: 'completed' | 'in_review' | 'archived'
  teacherName: string
  courseCode: string
  maximumMarks: number
  isArchived: boolean
}

export interface StudentEvaluationReport {
  studentUUID: string
  studentName?: string
  totalMarks: number
  maximumMarks: number
  overallConfidence: number
  status: 'auto_graded' | 'manual_review_required' | 'teacher_reviewed'
  teacherOverridesCount: number
  finalGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F'
  questions: QuestionEvaluation[]
  teacherNotes?: string
}

export interface EvaluationReportDetail {
  id: string
  assessmentName: string
  subject: string
  className: string
  section: string
  courseCode: string
  teacherName: string
  teacherEmail: string
  evaluationDate: string
  studentCount: number
  averageMarks: number
  maximumMarks: number
  averageConfidence: number
  manualReviewsCount: number
  teacherOverridesCount: number
  isArchived: boolean
  students: StudentEvaluationReport[]
}

export interface StudentHistoryItem {
  id: string
  reportId: string
  assessmentName: string
  courseCode: string
  subject: string
  date: string
  totalMarks: number
  maximumMarks: number
  confidence: number
  teacherReviewed: boolean
  finalGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F'
  overridesCount: number
}

export interface AnalyticsOverview {
  totalEvaluations: number
  averageScore: number
  averageConfidence: number
  manualReviewsCount: number
  teacherOverridesCount: number
  autoGradedPercentage: number
  monthlyEvaluations: { month: string; count: number }[]
  confidenceTrend: { date: string; confidence: number }[]
  marksTrend: { date: string; avgScore: number }[]
  subjectPerformance: { subject: string; avgScore: number; count: number }[]
  manualReviewDistribution: { category: string; count: number; color: string }[]
  autoVsManual: { month: string; autoGraded: number; manualReview: number }[]
  questionDifficulty: { questionNum: string; avgScore: number; maxScore: number; difficulty: 'Easy' | 'Medium' | 'Hard' }[]
}

export const INITIAL_MOCK_REPORTS: ReportSummary[] = [
  {
    id: 'REP-2026-001',
    assessmentName: 'CS106B Midterm Examination',
    subject: 'Computer Science',
    className: 'CS2026',
    section: 'Section A',
    evaluationDate: '2026-09-02',
    studentCount: 42,
    averageScore: 85.4,
    averageConfidence: 94.2,
    manualReviewsCount: 3,
    teacherOverridesCount: 2,
    status: 'completed',
    teacherName: 'Dr. Sarah Jenkins',
    courseCode: 'CS106B',
    maximumMarks: 100,
    isArchived: false,
  },
  {
    id: 'REP-2026-002',
    assessmentName: 'PHYS41 Quantum Mechanics Quiz 2',
    subject: 'Physics',
    className: 'PHYS2026',
    section: 'Section B',
    evaluationDate: '2026-08-28',
    studentCount: 38,
    averageScore: 78.9,
    averageConfidence: 91.5,
    manualReviewsCount: 5,
    teacherOverridesCount: 4,
    status: 'completed',
    teacherName: 'Prof. Alan Turing',
    courseCode: 'PHYS41',
    maximumMarks: 50,
    isArchived: false,
  },
  {
    id: 'REP-2026-003',
    assessmentName: 'MATH51 Linear Algebra Midterm',
    subject: 'Mathematics',
    className: 'MATH2026',
    section: 'Section A',
    evaluationDate: '2026-08-20',
    studentCount: 55,
    averageScore: 82.1,
    averageConfidence: 96.0,
    manualReviewsCount: 1,
    teacherOverridesCount: 1,
    status: 'completed',
    teacherName: 'Dr. Katherine Johnson',
    courseCode: 'MATH51',
    maximumMarks: 100,
    isArchived: false,
  },
  {
    id: 'REP-2026-004',
    assessmentName: 'ENG101 Technical Writing Assignment 3',
    subject: 'English',
    className: 'ENG2026',
    section: 'Section C',
    evaluationDate: '2026-08-15',
    studentCount: 30,
    averageScore: 91.2,
    averageConfidence: 89.4,
    manualReviewsCount: 6,
    teacherOverridesCount: 3,
    status: 'completed',
    teacherName: 'Prof. Maya Angelou',
    courseCode: 'ENG101',
    maximumMarks: 50,
    isArchived: false,
  },
  {
    id: 'REP-2026-005',
    assessmentName: 'CHEM102 Organic Synthesis Final Project',
    subject: 'Chemistry',
    className: 'CHEM2026',
    section: 'Section B',
    evaluationDate: '2026-07-29',
    studentCount: 45,
    averageScore: 76.5,
    averageConfidence: 88.1,
    manualReviewsCount: 8,
    teacherOverridesCount: 6,
    status: 'completed',
    teacherName: 'Dr. Marie Curie',
    courseCode: 'CHEM102',
    maximumMarks: 100,
    isArchived: true,
  },
  {
    id: 'REP-2026-006',
    assessmentName: 'CS182 Artificial Intelligence Quiz 1',
    subject: 'Computer Science',
    className: 'CS2026',
    section: 'Section A',
    evaluationDate: '2026-07-14',
    studentCount: 50,
    averageScore: 88.6,
    averageConfidence: 95.8,
    manualReviewsCount: 2,
    teacherOverridesCount: 1,
    status: 'completed',
    teacherName: 'Dr. Sarah Jenkins',
    courseCode: 'CS182',
    maximumMarks: 50,
    isArchived: true,
  },
]

export const MOCK_STUDENTS_LIST: StudentEvaluationReport[] = [
  {
    studentUUID: 'STU-A91F23',
    totalMarks: 85,
    maximumMarks: 100,
    overallConfidence: 94,
    status: 'teacher_reviewed',
    teacherOverridesCount: 1,
    finalGrade: 'A',
    teacherNotes: 'Excellent work on BST complexities. Overrode Q3 derivation for creative matrix approach.',
    questions: MOCK_EVALUATION_RESULT.questions,
  },
  {
    studentUUID: 'STU-B42C89',
    totalMarks: 92,
    maximumMarks: 100,
    overallConfidence: 98,
    status: 'auto_graded',
    teacherOverridesCount: 0,
    finalGrade: 'A+',
    questions: MOCK_EVALUATION_RESULT.questions.map((q) => ({ ...q, marksAwarded: q.maximumMarks })),
  },
  {
    studentUUID: 'STU-C78D12',
    totalMarks: 74,
    maximumMarks: 100,
    overallConfidence: 82,
    status: 'manual_review_required',
    teacherOverridesCount: 2,
    finalGrade: 'B',
    questions: MOCK_EVALUATION_RESULT.questions.map((q) => ({ ...q, confidence: 68, manualReviewRequired: true })),
  },
  {
    studentUUID: 'STU-D34E56',
    totalMarks: 88,
    maximumMarks: 100,
    overallConfidence: 96,
    status: 'auto_graded',
    teacherOverridesCount: 0,
    finalGrade: 'A',
    questions: MOCK_EVALUATION_RESULT.questions,
  },
  {
    studentUUID: 'STU-E89F01',
    totalMarks: 65,
    maximumMarks: 100,
    overallConfidence: 79,
    status: 'teacher_reviewed',
    teacherOverridesCount: 3,
    finalGrade: 'C+',
    questions: MOCK_EVALUATION_RESULT.questions,
  },
]

export const MOCK_ANALYTICS_DATA: AnalyticsOverview = {
  totalEvaluations: 243,
  averageScore: 84.7,
  averageConfidence: 93.8,
  manualReviewsCount: 25,
  teacherOverridesCount: 17,
  autoGradedPercentage: 89.7,
  monthlyEvaluations: [
    { month: 'Apr', count: 18 },
    { month: 'May', count: 32 },
    { month: 'Jun', count: 45 },
    { month: 'Jul', count: 52 },
    { month: 'Aug', count: 68 },
    { month: 'Sep', count: 28 },
  ],
  confidenceTrend: [
    { date: 'Aug 1', confidence: 91.2 },
    { date: 'Aug 8', confidence: 92.5 },
    { date: 'Aug 15', confidence: 93.1 },
    { date: 'Aug 22', confidence: 94.8 },
    { date: 'Aug 29', confidence: 95.4 },
    { date: 'Sep 3', confidence: 96.2 },
  ],
  marksTrend: [
    { date: 'Aug 1', avgScore: 81.0 },
    { date: 'Aug 8', avgScore: 83.2 },
    { date: 'Aug 15', avgScore: 84.5 },
    { date: 'Aug 22', avgScore: 85.0 },
    { date: 'Aug 29', avgScore: 86.8 },
    { date: 'Sep 3', avgScore: 87.4 },
  ],
  subjectPerformance: [
    { subject: 'Computer Science', avgScore: 87.2, count: 92 },
    { subject: 'Physics', avgScore: 79.5, count: 65 },
    { subject: 'Mathematics', avgScore: 83.8, count: 54 },
    { subject: 'English', avgScore: 90.1, count: 32 },
  ],
  manualReviewDistribution: [
    { category: 'Low Confidence (<75%)', count: 14, color: '#ef4444' },
    { category: 'Ambiguous Handwriting', count: 6, color: '#f59e0b' },
    { category: 'Rubric Alternative Match', count: 5, color: '#3b82f6' },
  ],
  autoVsManual: [
    { month: 'May', autoGraded: 29, manualReview: 3 },
    { month: 'Jun', autoGraded: 40, manualReview: 5 },
    { month: 'Jul', autoGraded: 46, manualReview: 6 },
    { month: 'Aug', autoGraded: 61, manualReview: 7 },
    { month: 'Sep', autoGraded: 24, manualReview: 4 },
  ],
  questionDifficulty: [
    { questionNum: 'Q1 (BST Lookup)', avgScore: 19.2, maxScore: 20, difficulty: 'Easy' },
    { questionNum: 'Q2 (Stack vs Heap)', avgScore: 18.5, maxScore: 20, difficulty: 'Easy' },
    { questionNum: 'Q3 (Matrix Multiplication)', avgScore: 14.8, maxScore: 20, difficulty: 'Hard' },
    { questionNum: 'Q4 (Thread Synchronization)', avgScore: 16.1, maxScore: 20, difficulty: 'Medium' },
    { questionNum: 'Q5 (Virtual Memory)', avgScore: 17.0, maxScore: 20, difficulty: 'Medium' },
  ],
}
