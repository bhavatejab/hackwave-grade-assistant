import { CriterionResult } from '../types/api'

export interface RubricPoint {
  point: string
  matched: boolean
  comment?: string
}

export interface QuestionEvaluation {
  id: string
  questionNumber: string // e.g. "Q1", "Q2"
  questionText: string
  maximumMarks: number
  marksAwarded: number
  originalAiMarks: number
  confidence: number // percentage e.g. 98, 58
  confidenceStatus: 'High' | 'Medium' | 'Low'
  studentUUID: string // e.g. "STU-A91F23"
  status: 'auto_graded' | 'manual_review_required' | 'teacher_reviewed'
  studentAnswerText: string
  studentAnswerImageUrl?: string
  expectedAnswer: string
  evidenceMatched: string[]
  evidenceMissing: string[]
  reasoning: string
  alternativeReasoning?: string
  reviewRecommendation: 'No Review Needed' | 'Recommended' | 'Manual Review Required'
  manualReviewRequired: boolean
  teacherNotes?: string
  isOverridden?: boolean
  overrideReason?: string
  criteria?: CriterionResult[]
  ocrConfidence?: number | null
}

export interface EvaluationResultPayload {
  studentUUID: string
  overallScore: number
  maximumMarks: number
  overallConfidence: number
  questionsEvaluated: number
  questionsRequiringReview: number
  teacherOverrides: number
  status: 'auto_graded' | 'pending_review' | 'finalized'
  assessmentName: string
  courseCode: string
  subject: string
  className: string
  section: string
  assessmentDate: string
  instructions?: string
  questions: QuestionEvaluation[]
}

export const MOCK_EVALUATION_RESULT: EvaluationResultPayload = {
  studentUUID: 'STU-A91F23',
  overallScore: 85,
  maximumMarks: 100,
  overallConfidence: 94,
  questionsEvaluated: 10,
  questionsRequiringReview: 2,
  teacherOverrides: 1,
  status: 'pending_review',
  assessmentName: 'CS106B Midterm Examination',
  courseCode: 'CS106B',
  subject: 'Computer Science',
  className: 'CS106B',
  section: 'Section A',
  assessmentDate: '2026-09-04',
  instructions: 'Standard closed-book midterm examination. Evaluated using UUID anonymization.',
  questions: [
    {
      id: 'q1',
      questionNumber: 'Q1',
      questionText: 'Define Big-O complexity for Binary Search Tree lookup in average and worst-case scenarios.',
      maximumMarks: 20,
      marksAwarded: 20,
      originalAiMarks: 20,
      confidence: 98,
      confidenceStatus: 'High',
      studentUUID: 'STU-A91F23',
      status: 'auto_graded',
      studentAnswerText:
        'Binary Search Tree lookup takes O(log N) in the average case when the tree is balanced. However, in the worst case when the BST degrades into a linked list, lookup takes O(N) time.',
      expectedAnswer:
        'Average Case: O(log N) for balanced BST. Worst Case: O(N) when degenerate/unbalanced tree.',
      evidenceMatched: [
        'Correct definition of average case O(log N)',
        'Correct identification of balanced tree condition',
        'Correct identification of worst case O(N)',
        'Mention of degenerate linked list structure',
      ],
      evidenceMissing: [],
      reasoning:
        'The student provided a flawless explanation covering both average and worst-case complexities along with structural conditions (balanced vs degenerate). Full marks awarded.',
      reviewRecommendation: 'No Review Needed',
      manualReviewRequired: false,
    },
    {
      id: 'q2',
      questionNumber: 'Q2',
      questionText: 'Explain the difference between stack allocation and heap allocation in C++ memory management.',
      maximumMarks: 20,
      marksAwarded: 19,
      originalAiMarks: 19,
      confidence: 95,
      confidenceStatus: 'High',
      studentUUID: 'STU-A91F23',
      status: 'auto_graded',
      studentAnswerText:
        'Stack allocation is fast and managed automatically by the compiler. Variables exist until function scope ends. Heap allocation is manual (using new/delete or malloc/free), slower, and can cause memory leaks if not freed.',
      expectedAnswer:
        'Stack: automatic lifetime, LIFO ordering, limited size. Heap: explicit dynamic allocation (new/delete), persistent lifetime, risk of leaks.',
      evidenceMatched: [
        'Automatic compiler scoping for Stack',
        'Explicit new/delete dynamic allocation for Heap',
        'Mention of memory leak risks',
      ],
      evidenceMissing: ['LIFO stack frame ordering detail omitted'],
      reasoning:
        'Student articulated key distinctions between automatic stack lifetimes and manual heap allocation accurately. Minus 1 mark for omitting stack frame LIFO structure.',
      reviewRecommendation: 'No Review Needed',
      manualReviewRequired: false,
    },
    {
      id: 'q3',
      questionNumber: 'Q3',
      questionText: 'Implement a recursive helper function to reverse a single linked list in-place.',
      maximumMarks: 20,
      marksAwarded: 16,
      originalAiMarks: 16,
      confidence: 81,
      confidenceStatus: 'Medium',
      studentUUID: 'STU-A91F23',
      status: 'auto_graded',
      studentAnswerText:
        'ListNode* reverseList(ListNode* head) { if (!head || !head->next) return head; ListNode* rest = reverseList(head->next); head->next->next = head; head->next = nullptr; return rest; }',
      expectedAnswer:
        'Base cases: null or single node. Recursively process head->next, update head->next->next = head, terminate head->next = nullptr.',
      evidenceMatched: [
        'Correct base cases (!head || !head->next)',
        'Correct recursive call step',
        'Correct pointer reversal (head->next->next = head)',
        'Correct tail termination (head->next = nullptr)',
      ],
      evidenceMissing: ['Alternative iterative approach submitted in margin notes'],
      reasoning:
        'Student algorithmically implemented the exact recursive pointer reversal. Margin notes contained an alternative iterative snippet.',
      alternativeReasoning:
        'Alternative reasoning detected. Student included secondary iterative diagram in margin notes. Teacher review recommended.',
      reviewRecommendation: 'Recommended',
      manualReviewRequired: false,
    },
    {
      id: 'q4',
      questionNumber: 'Q4',
      questionText: 'Derive the time complexity recurrence relation T(N) = 2T(N/2) + O(N) using the Master Theorem.',
      maximumMarks: 20,
      marksAwarded: 12,
      originalAiMarks: 12,
      confidence: 58,
      confidenceStatus: 'Low',
      studentUUID: 'STU-A91F23',
      status: 'manual_review_required',
      studentAnswerText:
        'a = 2, b = 2, f(n) = n. Comparing n^(log_b a) = n^1 = n with f(n) = n. Case 2 applies, so T(N) = O(N log N). [Diagram notation low confidence threshold]',
      studentAnswerImageUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      expectedAnswer:
        'a=2, b=2, log_b(a)=1. f(n) = Theta(n^1). By Master Theorem Case 2, T(N) = Theta(N log N). Proof required substitution steps.',
      evidenceMatched: ['Correct parameters a=2, b=2', 'Correct Case 2 identification'],
      evidenceMissing: ['Formal substitution proof steps missing', 'Handwritten proof diagram low confidence OCR confidence'],
      reasoning:
        'Handwritten diagram bounds could not be parsed with >75% confidence threshold. Requires instructor manual verification.',
      alternativeReasoning:
        'Ambiguous proof notation. Teacher review required to verify steps.',
      reviewRecommendation: 'Manual Review Required',
      manualReviewRequired: true,
    },
    {
      id: 'q5',
      questionNumber: 'Q5',
      questionText: 'Analyze memory overhead of std::vector dynamic resizing vs std::list node allocation in C++ STL.',
      maximumMarks: 20,
      marksAwarded: 18,
      originalAiMarks: 16,
      confidence: 97,
      confidenceStatus: 'High',
      studentUUID: 'STU-A91F23',
      status: 'teacher_reviewed',
      studentAnswerText:
        'std::vector reallocates geometrically (growth factor 1.5x - 2x) causing transient unused capacity. std::list allocates individual nodes adding 2 pointers (prev/next = 16 bytes on 64-bit) per element.',
      expectedAnswer:
        'Vector: contiguous buffer, capacity vs size overhead. List: 16-24 bytes node pointer overhead per element plus heap allocation metadata.',
      evidenceMatched: [
        'Geometric vector growth factor (1.5x - 2x)',
        '64-bit pointer overhead for doubly linked list nodes',
      ],
      evidenceMissing: [],
      reasoning:
        'Original AI awarded 16 marks. Teacher manually reviewed and bumped score to 18 marks based on accurate 64-bit pointer math.',
      reviewRecommendation: 'No Review Needed',
      manualReviewRequired: false,
      isOverridden: true,
      overrideReason: 'Student accurately calculated 64-bit pointer padding',
      teacherNotes: 'Excellent grasp of 64-bit memory alignment.',
    },
  ],
}
