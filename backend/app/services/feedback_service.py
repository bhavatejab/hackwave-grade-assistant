import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from app.models.grading import FeedbackRequest


class FeedbackService:

    def __init__(self):

        # Store the feedback dataset inside backend/data/
        self.data_directory = Path(__file__).resolve().parents[2] / "data"

        self.data_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        self.feedback_file = (
            self.data_directory / "feedback.jsonl"
        )

    def save_feedback(self, request: FeedbackRequest):

        feedback_id = str(uuid.uuid4())

        feedback_record = {
            "feedback_id": feedback_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),

            "question": request.question,
            "criterion_id": request.criterion_id,

            "student_answer": request.student_answer,

            "ai_score": request.ai_score,
            "ai_reasoning": request.ai_reasoning,
            "ai_evidence": request.ai_evidence,

            "reconsidered_score": request.reconsidered_score,

            "teacher_final_score": request.teacher_final_score,
            "teacher_feedback": request.teacher_feedback,

            "feedback_type": request.feedback_type
        }

        # Append one JSON object per line.
        # JSONL makes the file easy to process later
        # as a machine-learning dataset.
        with open(
            self.feedback_file,
            "a",
            encoding="utf-8"
        ) as file:

            file.write(
                json.dumps(
                    feedback_record,
                    ensure_ascii=False
                )
                + "\n"
            )

        return {
            "status": "success",
            "message": "Teacher feedback saved successfully.",
            "feedback_id": feedback_id
        }