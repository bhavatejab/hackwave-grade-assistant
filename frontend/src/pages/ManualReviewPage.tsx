import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Lock, ArrowRight, Filter } from 'lucide-react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SearchBar } from '../components/ui/SearchBar'
import { Pagination } from '../components/ui/Pagination'
import { PrivacyCard } from '../components/ui/PrivacyCard'
import { UuidBadge } from '../components/ui/UuidBadge'
import { useEvaluation } from '../contexts/EvaluationContext'

export const ManualReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const { evaluation } = useEvaluation()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Derive review rows dynamically from global single source of truth evaluation context
  const reviewRows = evaluation.questions
    .filter((q) => q.manualReviewRequired || q.confidence < 85)
    .map((q) => ({
      id: q.id,
      studentUUID: q.studentUUID,
      assessment: evaluation.assessmentName,
      questionNumber: q.questionNumber,
      confidence: q.confidence,
      reason: q.overrideReason || q.reasoning,
      status: q.manualReviewRequired ? ('Pending Review' as const) : ('In Verification' as const),
    }))

  const filteredRows = reviewRows.filter((r) => {
    return (
      r.studentUUID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assessment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.questionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Manual Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Low confidence and flagged questions requiring instructor verification.
          </p>
        </div>
      </div>

      <PrivacyCard text="Student identities remain hidden from AI. Only anonymous UUIDs are listed in the review queue." />

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter queue by Student UUID, assessment, or flag reason..."
          className="max-w-md"
        />
      </div>

      {/* Modern Table Subscribed to Single Source of Truth Context */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student UUID</TableHead>
            <TableHead>Assessment</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Flag Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.length === 0 ? (
            <TableRow>
              <TableCell className="text-center py-8 text-slate-400 text-xs" colSpan={7}>
                No items pending manual review. All questions verified.
              </TableCell>
            </TableRow>
          ) : (
            paginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <UuidBadge uuid={row.studentUUID} size="sm" />
                </TableCell>
                <TableCell className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {row.assessment}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                  {row.questionNumber}
                </TableCell>
                <TableCell className="font-mono text-xs text-red-600 dark:text-red-400 font-bold">
                  {row.confidence}%
                </TableCell>
                <TableCell className="text-xs text-amber-600 dark:text-amber-400 max-w-xs truncate font-medium">
                  {row.reason}
                </TableCell>
                <TableCell>
                  <Badge variant="warning" showDot>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/evaluations/review')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredRows.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}
