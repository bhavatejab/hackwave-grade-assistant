import uuid
import math
from datetime import datetime, timezone
from typing import Optional

from app.models.reports import CreateEvaluationRequest


class EvaluationWorkflowService:
    """
    Handles evaluation creation and file upload metadata tracking.
    Stores evaluation records in memory for the session.
    (Can be extended to persist to JSONL if needed.)
    """

    def __init__(self):
        self._evaluations: list = []
        self._upload_records: list = []

    def create_evaluation(self, request: CreateEvaluationRequest) -> dict:
        """Create a new evaluation draft record."""
        eval_id = f"eval_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        today = datetime.now(timezone.utc).date().isoformat()

        record = {
            "id": eval_id,
            "assessmentName": request.assessmentName,
            "subject": request.subject,
            "className": request.className,
            "section": request.section,
            "maxMarks": request.maxMarks,
            "assessmentDate": request.assessmentDate,
            "status": "draft",
            "createdDate": today,
            "instructions": request.instructions,
        }
        self._evaluations.append(record)
        return record

    def list_evaluations(self) -> list:
        return self._evaluations

    def record_upload(
        self,
        filename: str,
        filesize: int,
        filetype: str,
        upload_kind: str,  # 'question-paper' | 'rubric' | 'student-answer'
    ) -> dict:
        """Register an uploaded file's metadata."""
        prefix_map = {
            "question-paper": "qp",
            "rubric": "rub",
            "student-answer": "ans",
        }
        prefix = prefix_map.get(upload_kind, "file")
        file_id = f"{prefix}_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        timestamp = datetime.now(timezone.utc).strftime("%I:%M:%S %p")

        record: dict = {
            "id": file_id,
            "name": filename,
            "size": filesize,
            "type": filetype,
            "uploadedAt": timestamp,
            "status": "completed",
            "progress": 100,
        }

        # Assign anonymous UUID for student answers
        if upload_kind == "student-answer":
            random_hex = uuid.uuid4().hex[:6].upper()
            record["anonymousUuid"] = f"STU-{random_hex}"

        self._upload_records.append(record)
        return record

    def get_evaluation_status(self) -> dict:
        """Return a static pipeline status (can be made dynamic later)."""
        return {
            "overallProgress": 45,
            "estimatedTimeSeconds": 28,
            "pipeline": [
                {"id": "1", "name": "Reading Question Paper", "status": "completed", "duration": "1.2s"},
                {"id": "2", "name": "Reading Answer Key", "status": "completed", "duration": "2.1s"},
                {"id": "3", "name": "Reading Student Answers", "status": "processing"},
                {"id": "4", "name": "Generating Evaluation", "status": "waiting"},
                {"id": "5", "name": "Generating Evidence", "status": "waiting"},
                {"id": "6", "name": "Calculating Confidence", "status": "waiting"},
                {"id": "7", "name": "Preparing Results", "status": "waiting"},
            ],
        }

    def get_dashboard_summary(self, report_service) -> dict:
        """Compute dashboard summary stats from the report service."""
        active = report_service.get_reports(is_archived=False, limit=1000)
        archived = report_service.get_reports(is_archived=True, limit=1000)
        all_reports = active["reports"] + archived["reports"]

        if not all_reports:
            return {
                "totalEvaluations": 0,
                "manualReviewsCount": 0,
                "finalizedReportsCount": 0,
                "avgConfidenceScore": 0.0,
                "avgOverallScore": 0.0,
                "autoGradedPercentage": 0.0,
            }

        total = len(all_reports)
        avg_score = round(
            sum(r.get("averageScore", 0) for r in all_reports) / total, 1
        )
        avg_conf = round(
            sum(r.get("averageConfidence", 0) for r in all_reports) / total, 1
        )
        total_reviews = sum(r.get("manualReviewsCount", 0) for r in all_reports)
        finalized = sum(1 for r in all_reports if r.get("status") == "completed")
        total_students = sum(r.get("studentCount", 0) for r in all_reports) or 1
        auto_pct = round(max(0, (total_students - total_reviews) / total_students * 100), 1)

        return {
            "totalEvaluations": total,
            "manualReviewsCount": total_reviews,
            "finalizedReportsCount": finalized,
            "avgConfidenceScore": avg_conf,
            "avgOverallScore": avg_score,
            "autoGradedPercentage": auto_pct,
        }
