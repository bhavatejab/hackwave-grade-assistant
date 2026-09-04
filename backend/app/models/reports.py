from pydantic import BaseModel, Field
from typing import List, Optional, Any


# ------------------------------------
# Report Models
# ------------------------------------

class ReportSummary(BaseModel):
    id: str
    assessmentName: str
    subject: str
    className: str
    section: str
    evaluationDate: str
    studentCount: int
    averageScore: float
    averageConfidence: float
    manualReviewsCount: int
    teacherOverridesCount: int
    status: str  # 'completed' | 'in_review' | 'archived'
    teacherName: str
    courseCode: str
    maximumMarks: float
    isArchived: bool


class CriterionResultData(BaseModel):
    id: str
    score: float
    max_score: float
    reasoning: str = ""
    evidence: str = ""


class QuestionEvaluationData(BaseModel):
    id: str
    questionNumber: str
    questionText: str
    maximumMarks: float
    marksAwarded: float
    originalAiMarks: float
    confidence: float
    confidenceStatus: str
    studentUUID: str
    status: str
    studentAnswerText: str
    expectedAnswer: str
    evidenceMatched: List[str] = []
    evidenceMissing: List[str] = []
    reasoning: str = ""
    alternativeReasoning: Optional[str] = None
    reviewRecommendation: str
    manualReviewRequired: bool
    teacherNotes: Optional[str] = None
    isOverridden: Optional[bool] = None
    overrideReason: Optional[str] = None
    criteria: Optional[List[CriterionResultData]] = None
    ocrConfidence: Optional[float] = None


class StudentEvaluationReport(BaseModel):
    studentUUID: str
    studentName: Optional[str] = None
    totalMarks: float
    maximumMarks: float
    overallConfidence: float
    status: str  # 'auto_graded' | 'manual_review_required' | 'teacher_reviewed'
    teacherOverridesCount: int
    finalGrade: str
    questions: List[Any] = []
    teacherNotes: Optional[str] = None


class EvaluationReportDetail(BaseModel):
    id: str
    assessmentName: str
    subject: str
    className: str
    section: str
    courseCode: str
    teacherName: str
    teacherEmail: str
    evaluationDate: str
    studentCount: int
    averageMarks: float
    maximumMarks: float
    averageConfidence: float
    manualReviewsCount: int
    teacherOverridesCount: int
    isArchived: bool
    students: List[StudentEvaluationReport] = []


class StudentHistoryItem(BaseModel):
    id: str
    reportId: str
    assessmentName: str
    courseCode: str
    subject: str
    date: str
    totalMarks: float
    maximumMarks: float
    confidence: float
    teacherReviewed: bool
    finalGrade: str
    overridesCount: int


# ------------------------------------
# Analytics Models
# ------------------------------------

class MonthlyCount(BaseModel):
    month: str
    count: int


class TrendPoint(BaseModel):
    date: str
    confidence: Optional[float] = None
    avgScore: Optional[float] = None


class SubjectPerformance(BaseModel):
    subject: str
    avgScore: float
    count: int


class ReviewDistribution(BaseModel):
    category: str
    count: int
    color: str


class AutoVsManual(BaseModel):
    month: str
    autoGraded: int
    manualReview: int


class QuestionDifficulty(BaseModel):
    questionNum: str
    avgScore: float
    maxScore: float
    difficulty: str  # 'Easy' | 'Medium' | 'Hard'


class AnalyticsOverview(BaseModel):
    totalEvaluations: int
    averageScore: float
    averageConfidence: float
    manualReviewsCount: int
    teacherOverridesCount: int
    autoGradedPercentage: float
    monthlyEvaluations: List[MonthlyCount]
    confidenceTrend: List[TrendPoint]
    marksTrend: List[TrendPoint]
    subjectPerformance: List[SubjectPerformance]
    manualReviewDistribution: List[ReviewDistribution]
    autoVsManual: List[AutoVsManual]
    questionDifficulty: List[QuestionDifficulty]


# ------------------------------------
# Student Models
# ------------------------------------

class StudentRecord(BaseModel):
    id: str
    name: str
    rollNumber: str
    uuid: str
    status: str  # 'Evaluated' | 'Pending Verification' | 'Requires Review'
    course: str


# ------------------------------------
# Evaluation Workflow Models
# ------------------------------------

class CreateEvaluationRequest(BaseModel):
    assessmentName: str
    subject: str
    className: str
    section: str
    maxMarks: float
    assessmentDate: str
    instructions: Optional[str] = None


class EvaluationRecord(BaseModel):
    id: str
    assessmentName: str
    subject: str
    className: str
    section: str
    maxMarks: float
    assessmentDate: str
    status: str  # 'draft' | 'staging' | 'processing' | 'completed'
    createdDate: str


class UploadedFileRecord(BaseModel):
    id: str
    name: str
    size: int
    type: str
    uploadedAt: str
    status: str  # 'uploading' | 'completed' | 'failed'
    progress: int
    anonymousUuid: Optional[str] = None


class PipelineStage(BaseModel):
    id: str
    name: str
    status: str  # 'completed' | 'processing' | 'waiting'
    duration: Optional[str] = None


class EvaluationStatusResponse(BaseModel):
    overallProgress: int
    estimatedTimeSeconds: int
    pipeline: List[PipelineStage]


# ------------------------------------
# Dashboard Models
# ------------------------------------

class DashboardSummary(BaseModel):
    totalEvaluations: int
    manualReviewsCount: int
    finalizedReportsCount: int
    avgConfidenceScore: float
    avgOverallScore: float
    autoGradedPercentage: float


# ------------------------------------
# Request helpers
# ------------------------------------

class ArchiveRequest(BaseModel):
    id: str


class AddReportRequest(ReportSummary):
    pass


class PaginatedReportsResponse(BaseModel):
    reports: List[ReportSummary]
    total: int
    page: int
    totalPages: int
