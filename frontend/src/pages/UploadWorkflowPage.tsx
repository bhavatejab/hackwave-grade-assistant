import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Play,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Cpu,
} from 'lucide-react'
import { QuestionPaperUploadCard } from '../components/evaluation/QuestionPaperUploadCard'
import { RubricUploadCard } from '../components/evaluation/RubricUploadCard'
import { StudentAnswersUploadCard } from '../components/evaluation/StudentAnswersUploadCard'
import { UploadHistoryList } from '../components/evaluation/UploadHistoryList'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { useEvaluation } from '../contexts/EvaluationContext'
import { useNotifications } from '../contexts/NotificationContext'
import { evaluationService } from '../services/evaluationService'
import { RubricCriterion } from '../types/api'

export const UploadWorkflowPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation, setGradedEvaluation } = useEvaluation()
  const { addNotification } = useNotifications()

  const [, setQpSelected] = useState<File | null>(null)
  const [studentAnswerFile, setStudentAnswerFile] = useState<File | null>(null)
  const [rubricFileSelected, setRubricFileSelected] = useState<File | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [questionText, setQuestionText] = useState<string>(
    'Define Big-O complexity for Binary Search Tree lookup in average and worst-case scenarios.'
  )
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([
    {
      id: 'crit_1',
      description: 'Correct definition of average case O(log N) for balanced BST',
      max_score: 10,
    },
    {
      id: 'crit_2',
      description: 'Correct identification of worst case O(N) when tree is degenerate/unbalanced',
      max_score: 10,
    },
  ])
  const [studentAnswer, setStudentAnswer] = useState<string>(
    'Binary Search Tree lookup takes O(log N) in the average case when the tree is balanced. However, in the worst case when the BST degrades into a linked list, lookup takes O(N) time.'
  )
  const [ocrConfidence, setOcrConfidence] = useState<string>('0.95')

  const handleAddCriterion = () => {
    const nextId = `crit_${rubricCriteria.length + 1}`
    setRubricCriteria([
      ...rubricCriteria,
      { id: nextId, description: 'Additional criterion description', max_score: 5 },
    ])
  }

  const handleRemoveCriterion = (id: string) => {
    if (rubricCriteria.length <= 1) {
      setErrorMessage('At least one rubric criterion is required.')
      return
    }
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id))
  }

  const handleUpdateCriterion = (
    id: string,
    field: 'description' | 'max_score',
    value: string | number
  ) => {
    setRubricCriteria(
      rubricCriteria.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: field === 'max_score' ? Number(value) : value }
        }
        return c
      })
    )
  }

  const handleEvaluate = async () => {
    setErrorMessage(null)

    // Validation
    if (!questionText.trim()) {
      setErrorMessage('Question text cannot be empty.')
      return
    }
    if (rubricCriteria.length === 0) {
      setErrorMessage('At least one rubric criterion must be defined.')
      return
    }

    const parsedOcrConfidence = ocrConfidence.trim() ? parseFloat(ocrConfidence) : null
    setIsEvaluating(true)

    try {
      if (studentAnswerFile) {
        // Run OCR + Featherless AI end-to-end integration API
        const formData = new FormData()
        formData.append('file', studentAnswerFile)
        if (rubricFileSelected) {
          formData.append('rubric_file', rubricFileSelected)
        }
        formData.append('assessment_name', evaluation.assessmentName || 'End-Semester Examination')
        formData.append('subject', evaluation.subject || 'Computer Science')
        formData.append('class_name', evaluation.className || 'CS106B')
        formData.append('course_code', evaluation.courseCode || 'CS106B')
        formData.append('section', evaluation.section || 'Section A')
        formData.append('maximum_marks', String(evaluation.maximumMarks || 50))
        formData.append('student_uuid', 'STU-A91F23')

        const ocrGradeResult = await evaluationService.uploadAndGradeAnswerSheet(formData)

        if (ocrGradeResult && ocrGradeResult.questions && ocrGradeResult.questions[0]) {
          const qEval = ocrGradeResult.questions[0]
          setGradedEvaluation(
            {
              total_score: ocrGradeResult.overallScore,
              max_score: ocrGradeResult.maximumMarks,
              criteria: qEval.criteria || [],
              alternative_reasoning_detected: false,
              confidence: ocrGradeResult.overallConfidence / 100,
              requires_teacher_review: ocrGradeResult.status === 'pending_review',
              ocr_confidence: ocrGradeResult.ocrConfidence,
            },
            {
              questionText: questionText.trim(),
              studentAnswerText: ocrGradeResult.extractedText || studentAnswer.trim(),
              rubric: rubricCriteria,
              studentUuid: 'STU-A91F23',
              assessmentName: evaluation.assessmentName,
            }
          )
        }
      } else {
        // Direct text grading request via POST /api/grade
        const result = await evaluationService.gradeAnswer({
          question: questionText.trim(),
          rubric: rubricCriteria,
          student_answer: studentAnswer.trim(),
          ocr_confidence: parsedOcrConfidence,
        })

        setGradedEvaluation(result, {
          questionText: questionText.trim(),
          studentAnswerText: studentAnswer.trim(),
          rubric: rubricCriteria,
          studentUuid: 'STU-A91F23',
          assessmentName: evaluation.assessmentName,
        })
      }

      addNotification({
        title: 'Grading Successful',
        message: `Evaluation completed via Featherless AI.`,
        type: 'success',
      })

      navigate('/evaluations/results')
    } catch (err: any) {
      console.error('Grading API error:', err)
      const detailMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')
          ? 'Cannot connect to FastAPI backend at http://127.0.0.1:8000. Please ensure the backend server is running.'
          : 'Failed to complete grading evaluation. Please check the backend service.')

      setErrorMessage(detailMsg)
      addNotification({
        title: 'Evaluation Error',
        message: detailMsg,
        type: 'danger',
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Upload Assessment Files & Grade
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Step 2 of 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stage Question Paper, Rubric, and Student Answer Sheets for{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {evaluation.assessmentName}
            </span>{' '}
            ({evaluation.courseCode} • {evaluation.section} • {evaluation.maximumMarks} Max Marks).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/evaluations/new')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Details
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={isEvaluating}
            onClick={handleEvaluate}
            rightIcon={<Play className="w-4 h-4 fill-current" />}
          >
            {isEvaluating ? 'Evaluating with AI...' : 'Evaluate / Grade Answer'}
          </Button>
        </div>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. Only anonymous UUIDs are processed during evaluation execution." />

      {/* Teacher-friendly Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-red-900 dark:text-red-200">
              Grading Request Issue
            </span>
            <p className="font-normal leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading state indicator banner */}
      {isEvaluating && (
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
            <div>
              <span className="font-bold text-sm block">Grading via FastAPI & Featherless AI</span>
              <span className="text-blue-600 dark:text-blue-300">
                Evaluating answer against rubric criteria, checking partial credit and alternative reasoning...
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-blue-500 font-semibold uppercase">Processing</span>
        </div>
      )}

      {/* Live AI Grading Configuration Card (Direct Text & OCR Fallback Input) */}
      <Card className="border-blue-200 dark:border-blue-900 shadow-sm bg-slate-50/60 dark:bg-slate-900/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Grading Input & Rubric Configuration</CardTitle>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              FastAPI: POST /api/grade
            </span>
          </div>
          <CardDescription>
            Specify the exam question, criteria with maximum marks, and student answer (supports typed text or OCR extracted text).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Question Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Exam Question
            </label>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Define Big-O complexity for Binary Search Tree lookup..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Rubric Criteria List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rubric Criteria ({rubricCriteria.length})
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCriterion}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Criterion
              </Button>
            </div>

            <div className="space-y-2">
              {rubricCriteria.map((criterion, idx) => (
                <div
                  key={criterion.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3"
                >
                  <span className="font-mono text-xs font-bold text-slate-500 w-16 shrink-0">
                    {criterion.id}
                  </span>
                  <input
                    type="text"
                    value={criterion.description}
                    onChange={(e) =>
                      handleUpdateCriterion(criterion.id, 'description', e.target.value)
                    }
                    placeholder="Criterion description..."
                    className="flex-1 w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">Max:</span>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={criterion.max_score}
                      onChange={(e) =>
                        handleUpdateCriterion(criterion.id, 'max_score', e.target.value)
                      }
                      className="w-16 px-2 py-1.5 text-xs font-mono text-center rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(criterion.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remove Criterion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Answer & OCR Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Student Answer (Typed or OCR Extracted Text)
              </label>
              <textarea
                rows={3}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Student submission text to be evaluated by AI..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                OCR Confidence
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={ocrConfidence}
                onChange={(e) => setOcrConfidence(e.target.value)}
                placeholder="e.g. 0.95 or leave empty"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Optional OCR confidence score (0.0 - 1.0).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Cards */}
      <div className="space-y-6">
        <QuestionPaperUploadCard onFileSelect={setQpSelected} />
        <RubricUploadCard onFileSelect={setRubricFileSelected} />
        <StudentAnswersUploadCard
          onFilesChange={(files) => {
            if (files && files.length > 0) {
              setStudentAnswerFile(new File(['student answer content'], files[0].name, { type: 'application/pdf' }))
            }
          }}
        />
      </div>

      {/* Upload History Audit Section */}
      <UploadHistoryList />

      {/* Bottom Floating CTA Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs sm:text-sm font-semibold">
            Ready to evaluate: Question, rubric criteria, and student response staged.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          isLoading={isEvaluating}
          onClick={handleEvaluate}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isEvaluating ? 'Evaluating with AI...' : 'Evaluate / Grade Answer'}
        </Button>
      </div>
    </div>
  )
}

