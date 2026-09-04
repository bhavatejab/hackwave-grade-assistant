from pydantic import BaseModel, Field
from typing import List


class RubricCriterion(BaseModel):
    id: str
    description: str
    max_score: float


class GradeRequest(BaseModel):
    question: str
    rubric: List[RubricCriterion]
    student_answer: str
    ocr_confidence: float | None = None


class CriterionResult(BaseModel):
    id: str
    score: float
    max_score: float
    reasoning: str
    evidence: str


class GradeResponse(BaseModel):
    total_score: float
    max_score: float
    criteria: List[CriterionResult]
    alternative_reasoning_detected: bool
    confidence: float = Field(ge=0, le=1)
    requires_teacher_review: bool
    ocr_confidence: float | None = None


# -----------------------------
# Challenge AI Models
# -----------------------------

class ChallengeRequest(BaseModel):
    question: str
    criterion: RubricCriterion
    student_answer: str

    original_score: float
    original_reasoning: str
    original_evidence: str

    teacher_challenge: str


class ChallengeResponse(BaseModel):
    criterion_id: str

    original_score: float
    reconsidered_score: float
    max_score: float

    decision: str
    reasoning: str
    evidence: str

    confidence: float = Field(ge=0, le=1)
    requires_teacher_review: bool


# -----------------------------
# Teacher Feedback Models
# -----------------------------

class FeedbackRequest(BaseModel):
    question: str
    criterion_id: str

    student_answer: str

    ai_score: float
    ai_reasoning: str
    ai_evidence: str

    reconsidered_score: float | None = None

    teacher_final_score: float
    teacher_feedback: str

    feedback_type: str = "teacher_override"


class FeedbackResponse(BaseModel):
    status: str
    message: str
    feedback_id: str