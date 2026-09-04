import json

from app.services.featherless_service import FeatherlessService
from app.models.grading import GradeRequest


class GradingService:

    def __init__(self):
        self.featherless = FeatherlessService()

    def grade_answer(self, request: GradeRequest):

        # Convert the teacher's rubric into text for the AI
        rubric_text = "\n".join(
            [
                f"- {criterion.id}: {criterion.description} "
                f"(Maximum: {criterion.max_score} marks)"
                for criterion in request.rubric
            ]
        )

        # Instructions given to the grading AI
        system_prompt = """
You are an expert academic grading assistant.

Your job is to evaluate a student's answer against a teacher-provided
question and rubric.

IMPORTANT RULES:

1. Grade ONLY according to the provided rubric.
2. Give partial credit when the student demonstrates partial understanding.
3. Accept alternative valid reasoning even if the wording differs from
   the expected answer.
4. Do not invent evidence that is not present in the student's answer.
5. For every rubric criterion, provide:
   - score
   - reasoning
   - evidence from the student's answer
6. The score for each criterion must not exceed its max_score.
7. The score for each criterion must not be negative.
8. Detect valid alternative reasoning when the student uses a different
   but academically correct approach.
9. Give a confidence value between 0 and 1.
10. If the answer is ambiguous, incomplete, contradictory, or difficult
    to judge, set requires_teacher_review to true.
11. Return ONLY valid JSON.
12. Do NOT include markdown code fences.
13. Do NOT include any text before or after the JSON.

Required JSON structure:

{
  "total_score": 0,
  "criteria": [
    {
      "id": "criterion_id",
      "score": 0,
      "max_score": 0,
      "reasoning": "Why this score was given",
      "evidence": "Relevant evidence from the student's answer"
    }
  ],
  "alternative_reasoning_detected": false,
  "confidence": 0.0,
  "requires_teacher_review": false
}
"""

        # Student/question/rubric information sent to the AI
        user_prompt = f"""
QUESTION:
{request.question}

RUBRIC:
{rubric_text}

STUDENT ANSWER:
{request.student_answer}

Evaluate the student's answer carefully against every rubric criterion.

Return one result for every criterion.

Remember:
- Use the exact criterion IDs provided.
- Do not give more marks than the criterion allows.
- Give partial credit where appropriate.
- Accept correct alternative reasoning.
"""

        # Call Featherless AI
        ai_response = self.featherless.generate(
            system_prompt,
            user_prompt
        )

        # Convert AI JSON into our API response
        return self._parse_response(ai_response, request)

    def _parse_response(
        self,
        ai_response: str,
        request: GradeRequest
    ):

        try:
            # Parse the AI response
            result = json.loads(ai_response)

            # Calculate maximum possible score from the teacher's rubric
            max_score = sum(
                criterion.max_score
                for criterion in request.rubric
            )

            # Calculate the total score ourselves.
            # We do NOT trust the AI's total_score.
            total_score = 0

            for criterion_result in result.get("criteria", []):

                score = float(criterion_result.get("score", 0))
                criterion_max = float(
                    criterion_result.get("max_score", 0)
                )

                # Prevent negative scores
                score = max(score, 0)

                # Prevent scores above the criterion maximum
                score = min(score, criterion_max)

                criterion_result["score"] = score

                total_score += score

            # Backend determines the final total
            result["total_score"] = total_score
            result["max_score"] = max_score

            # Make sure confidence is valid
            confidence = float(
                result.get("confidence", 0)
            )

            confidence = max(0, min(confidence, 1))

            result["confidence"] = confidence

            # Low confidence should require teacher review
            if confidence < 0.70:
                result["requires_teacher_review"] = True

            result["ocr_confidence"] = request.ocr_confidence

            return result

        except (json.JSONDecodeError, TypeError, ValueError):

            # Safe fallback if the AI returns malformed data
            max_score = sum(
                criterion.max_score
                for criterion in request.rubric
            )

            return {
                "total_score": 0,
                "max_score": max_score,
                "criteria": [],
                "alternative_reasoning_detected": False,
                "confidence": 0,
                "requires_teacher_review": True,
                "ocr_confidence": request.ocr_confidence
            }