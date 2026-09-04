from app.services.featherless_service import FeatherlessService
from app.models.grading import ChallengeRequest
import json


class ChallengeService:

    def __init__(self):
        self.featherless = FeatherlessService()

    def challenge_grade(self, request: ChallengeRequest):

        system_prompt = """
You are an expert academic grading assistant reviewing a
teacher's challenge to an AI-generated grade.

The original AI grading may be correct or incorrect.

Your job is to independently reconsider ONLY the disputed rubric criterion.

IMPORTANT RULES:

1. Carefully read the original question.
2. Carefully read the rubric criterion.
3. Carefully read the student's answer.
4. Consider the original AI score, reasoning, and evidence.
5. Consider the teacher's challenge.
6. Determine whether the teacher's challenge provides valid evidence
   that the original score should change.
7. Accept alternative valid reasoning if it satisfies the rubric.
8. Give partial credit when appropriate.
9. Never award more than the criterion's maximum score.
10. Never award a negative score.
11. Do not invent evidence that is not present in the student's answer.
12. The reconsidered score must be based on the rubric.
13. Return ONLY valid JSON.
14. Do not use markdown code fences.

Decision must be one of:

"score_changed"
"score_unchanged"
"needs_teacher_review"

Required JSON:

{
  "reconsidered_score": 0,
  "decision": "score_changed",
  "reasoning": "Explanation of the reconsideration",
  "evidence": "Evidence from the student's answer",
  "confidence": 0.0,
  "requires_teacher_review": false
}
"""

        user_prompt = f"""
QUESTION:
{request.question}

RUBRIC CRITERION:
ID: {request.criterion.id}
Description: {request.criterion.description}
Maximum Score: {request.criterion.max_score}

STUDENT ANSWER:
{request.student_answer}

ORIGINAL AI SCORE:
{request.original_score}/{request.criterion.max_score}

ORIGINAL AI REASONING:
{request.original_reasoning}

ORIGINAL AI EVIDENCE:
{request.original_evidence}

TEACHER CHALLENGE:
{request.teacher_challenge}

Reconsider the original score using the teacher's challenge.

Return ONLY the required JSON.
"""

        ai_response = self.featherless.generate(
            system_prompt,
            user_prompt
        )

        return self._parse_response(ai_response, request)

    def _parse_response(
        self,
        ai_response: str,
        request: ChallengeRequest
    ):

        try:
            result = json.loads(ai_response)

            max_score = float(request.criterion.max_score)

            reconsidered_score = float(
                result.get("reconsidered_score", request.original_score)
            )

            # Never allow a negative score
            reconsidered_score = max(
                reconsidered_score,
                0
            )

            # Never allow a score above the rubric maximum
            reconsidered_score = min(
                reconsidered_score,
                max_score
            )

            confidence = float(
                result.get("confidence", 0)
            )

            # Keep confidence between 0 and 1
            confidence = max(
                0,
                min(confidence, 1)
            )

            original_score = float(
                request.original_score
            )

            # Backend determines the decision
            if reconsidered_score != original_score:
                decision = "score_changed"
            else:
                decision = "score_unchanged"

            requires_review = bool(
                result.get("requires_teacher_review", False)
            )

            # Low confidence automatically requires review
            if confidence < 0.70:
                requires_review = True
                decision = "needs_teacher_review"

            return {
                "criterion_id": request.criterion.id,
                "original_score": original_score,
                "reconsidered_score": reconsidered_score,
                "max_score": max_score,
                "decision": decision,
                "reasoning": result.get(
                    "reasoning",
                    "The AI reconsidered the criterion."
                ),
                "evidence": result.get(
                    "evidence",
                    ""
                ),
                "confidence": confidence,
                "requires_teacher_review": requires_review
            }

        except (json.JSONDecodeError, TypeError, ValueError):

            return {
                "criterion_id": request.criterion.id,
                "original_score": request.original_score,
                "reconsidered_score": request.original_score,
                "max_score": request.criterion.max_score,
                "decision": "needs_teacher_review",
                "reasoning": (
                    "The AI response could not be reliably interpreted. "
                    "Teacher review is required."
                ),
                "evidence": "",
                "confidence": 0,
                "requires_teacher_review": True
            }