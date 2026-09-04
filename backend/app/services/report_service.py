import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from app.models.reports import (
    ReportSummary,
    EvaluationReportDetail,
    StudentEvaluationReport,
    StudentHistoryItem,
    PaginatedReportsResponse,
)


# Seed data matching the frontend mock reports exactly
SEED_REPORTS = [
    {
        "id": "REP-2026-001",
        "assessmentName": "CS106B Midterm Examination",
        "subject": "Computer Science",
        "className": "CS2026",
        "section": "Section A",
        "evaluationDate": "2026-09-02",
        "studentCount": 42,
        "averageScore": 85.4,
        "averageConfidence": 94.2,
        "manualReviewsCount": 3,
        "teacherOverridesCount": 2,
        "status": "completed",
        "teacherName": "Dr. Sarah Jenkins",
        "courseCode": "CS106B",
        "maximumMarks": 100.0,
        "isArchived": False,
    },
    {
        "id": "REP-2026-002",
        "assessmentName": "PHYS41 Quantum Mechanics Quiz 2",
        "subject": "Physics",
        "className": "PHYS2026",
        "section": "Section B",
        "evaluationDate": "2026-08-28",
        "studentCount": 38,
        "averageScore": 78.9,
        "averageConfidence": 91.5,
        "manualReviewsCount": 5,
        "teacherOverridesCount": 4,
        "status": "completed",
        "teacherName": "Prof. Alan Turing",
        "courseCode": "PHYS41",
        "maximumMarks": 50.0,
        "isArchived": False,
    },
    {
        "id": "REP-2026-003",
        "assessmentName": "MATH51 Linear Algebra Midterm",
        "subject": "Mathematics",
        "className": "MATH2026",
        "section": "Section A",
        "evaluationDate": "2026-08-20",
        "studentCount": 55,
        "averageScore": 82.1,
        "averageConfidence": 96.0,
        "manualReviewsCount": 1,
        "teacherOverridesCount": 1,
        "status": "completed",
        "teacherName": "Dr. Katherine Johnson",
        "courseCode": "MATH51",
        "maximumMarks": 100.0,
        "isArchived": False,
    },
    {
        "id": "REP-2026-004",
        "assessmentName": "ENG101 Technical Writing Assignment 3",
        "subject": "English",
        "className": "ENG2026",
        "section": "Section C",
        "evaluationDate": "2026-08-15",
        "studentCount": 30,
        "averageScore": 91.2,
        "averageConfidence": 89.4,
        "manualReviewsCount": 6,
        "teacherOverridesCount": 3,
        "status": "completed",
        "teacherName": "Prof. Maya Angelou",
        "courseCode": "ENG101",
        "maximumMarks": 50.0,
        "isArchived": False,
    },
    {
        "id": "REP-2026-005",
        "assessmentName": "CHEM102 Organic Synthesis Final Project",
        "subject": "Chemistry",
        "className": "CHEM2026",
        "section": "Section B",
        "evaluationDate": "2026-07-29",
        "studentCount": 45,
        "averageScore": 76.5,
        "averageConfidence": 88.1,
        "manualReviewsCount": 8,
        "teacherOverridesCount": 6,
        "status": "archived",
        "teacherName": "Dr. Marie Curie",
        "courseCode": "CHEM102",
        "maximumMarks": 100.0,
        "isArchived": True,
    },
    {
        "id": "REP-2026-006",
        "assessmentName": "CS182 Artificial Intelligence Quiz 1",
        "subject": "Computer Science",
        "className": "CS2026",
        "section": "Section A",
        "evaluationDate": "2026-07-14",
        "studentCount": 50,
        "averageScore": 88.6,
        "averageConfidence": 95.8,
        "manualReviewsCount": 2,
        "teacherOverridesCount": 1,
        "status": "archived",
        "teacherName": "Dr. Sarah Jenkins",
        "courseCode": "CS182",
        "maximumMarks": 50.0,
        "isArchived": True,
    },
]

# Seed student history data
SEED_STUDENT_HISTORY = [
    {
        "id": "HIST-1",
        "reportId": "REP-2026-001",
        "assessmentName": "CS106B Midterm Examination",
        "courseCode": "CS106B",
        "subject": "Computer Science",
        "date": "2026-09-02",
        "totalMarks": 85.0,
        "maximumMarks": 100.0,
        "confidence": 94.0,
        "teacherReviewed": True,
        "finalGrade": "A",
        "overridesCount": 1,
    },
    {
        "id": "HIST-2",
        "reportId": "REP-2026-003",
        "assessmentName": "MATH51 Linear Algebra Midterm",
        "courseCode": "MATH51",
        "subject": "Mathematics",
        "date": "2026-08-20",
        "totalMarks": 91.0,
        "maximumMarks": 100.0,
        "confidence": 98.0,
        "teacherReviewed": False,
        "finalGrade": "A+",
        "overridesCount": 0,
    },
    {
        "id": "HIST-3",
        "reportId": "REP-2026-006",
        "assessmentName": "CS182 Artificial Intelligence Quiz 1",
        "courseCode": "CS182",
        "subject": "Computer Science",
        "date": "2026-07-14",
        "totalMarks": 44.0,
        "maximumMarks": 50.0,
        "confidence": 96.0,
        "teacherReviewed": True,
        "finalGrade": "A",
        "overridesCount": 0,
    },
]

# Seed students list for reports
SEED_STUDENTS_IN_REPORT = [
    {
        "studentUUID": "STU-A91F23",
        "totalMarks": 85.0,
        "maximumMarks": 100.0,
        "overallConfidence": 94.0,
        "status": "teacher_reviewed",
        "teacherOverridesCount": 1,
        "finalGrade": "A",
        "questions": [],
        "teacherNotes": "Excellent work on BST complexities.",
    },
    {
        "studentUUID": "STU-B42C89",
        "totalMarks": 92.0,
        "maximumMarks": 100.0,
        "overallConfidence": 98.0,
        "status": "auto_graded",
        "teacherOverridesCount": 0,
        "finalGrade": "A+",
        "questions": [],
    },
    {
        "studentUUID": "STU-C78D12",
        "totalMarks": 74.0,
        "maximumMarks": 100.0,
        "overallConfidence": 82.0,
        "status": "manual_review_required",
        "teacherOverridesCount": 2,
        "finalGrade": "B",
        "questions": [],
    },
    {
        "studentUUID": "STU-D34E56",
        "totalMarks": 88.0,
        "maximumMarks": 100.0,
        "overallConfidence": 96.0,
        "status": "auto_graded",
        "teacherOverridesCount": 0,
        "finalGrade": "A",
        "questions": [],
    },
    {
        "studentUUID": "STU-E89F01",
        "totalMarks": 65.0,
        "maximumMarks": 100.0,
        "overallConfidence": 79.0,
        "status": "teacher_reviewed",
        "teacherOverridesCount": 3,
        "finalGrade": "C+",
        "questions": [],
    },
]


class ReportService:

    def __init__(self):
        self.data_dir = Path(__file__).resolve().parents[2] / "data"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.reports_file = self.data_dir / "reports.jsonl"

        # Seed initial data if file is empty or doesn't exist
        if not self.reports_file.exists() or self.reports_file.stat().st_size == 0:
            self._seed_initial_data()

    def _seed_initial_data(self):
        """Write the seed reports to the JSONL file."""
        with open(self.reports_file, "w", encoding="utf-8") as f:
            for report in SEED_REPORTS:
                f.write(json.dumps(report, ensure_ascii=False) + "\n")

    def _load_all(self) -> List[dict]:
        """Load all report records from JSONL."""
        reports = []
        if not self.reports_file.exists():
            return reports
        with open(self.reports_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        reports.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
        return reports

    def _save_all(self, reports: List[dict]):
        """Overwrite the JSONL file with all records."""
        with open(self.reports_file, "w", encoding="utf-8") as f:
            for report in reports:
                f.write(json.dumps(report, ensure_ascii=False) + "\n")

    def get_reports(
        self,
        is_archived: bool = False,
        search: Optional[str] = None,
        subject: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "date",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        all_reports = self._load_all()

        # Filter by archived state
        filtered = [r for r in all_reports if r.get("isArchived", False) == is_archived]

        # Search filter
        if search:
            q = search.lower()
            filtered = [
                r for r in filtered
                if q in r.get("assessmentName", "").lower()
                or q in r.get("subject", "").lower()
                or q in r.get("className", "").lower()
                or q in r.get("section", "").lower()
                or q in r.get("courseCode", "").lower()
                or q in r.get("id", "").lower()
            ]

        # Subject filter
        if subject and subject != "all":
            filtered = [r for r in filtered if r.get("subject", "").lower() == subject.lower()]

        # Status filter
        if status and status != "all":
            filtered = [r for r in filtered if r.get("status", "") == status]

        # Sort
        def sort_key(r):
            if sort_by == "score":
                return r.get("averageScore", 0)
            elif sort_by == "confidence":
                return r.get("averageConfidence", 0)
            elif sort_by == "name":
                return r.get("assessmentName", "")
            else:
                return r.get("evaluationDate", "")

        filtered.sort(key=sort_key, reverse=(sort_order == "desc"))

        # Pagination
        total = len(filtered)
        total_pages = max(1, (total + limit - 1) // limit)
        start = (page - 1) * limit
        paginated = filtered[start: start + limit]

        return {
            "reports": paginated,
            "total": total,
            "page": page,
            "totalPages": total_pages,
        }

    def get_report_by_id(self, report_id: str) -> Optional[dict]:
        all_reports = self._load_all()
        report = next((r for r in all_reports if r.get("id") == report_id), None)
        if not report:
            # Fall back to first report if not found
            report = all_reports[0] if all_reports else None
        if not report:
            return None

        teacher_name = report.get("teacherName", "")
        safe_email = teacher_name.lower().replace(" ", "").replace(".", "") if teacher_name else "teacher"

        return {
            "id": report["id"],
            "assessmentName": report["assessmentName"],
            "subject": report["subject"],
            "className": report["className"],
            "section": report["section"],
            "courseCode": report["courseCode"],
            "teacherName": teacher_name,
            "teacherEmail": f"{safe_email}@university.edu",
            "evaluationDate": report["evaluationDate"],
            "studentCount": report["studentCount"],
            "averageMarks": report["averageScore"],
            "maximumMarks": report["maximumMarks"],
            "averageConfidence": report["averageConfidence"],
            "manualReviewsCount": report["manualReviewsCount"],
            "teacherOverridesCount": report["teacherOverridesCount"],
            "isArchived": report["isArchived"],
            "students": SEED_STUDENTS_IN_REPORT,
        }

    def get_student_report(self, report_id: str, student_uuid: str) -> Optional[dict]:
        student = next(
            (s for s in SEED_STUDENTS_IN_REPORT if s["studentUUID"] == student_uuid),
            SEED_STUDENTS_IN_REPORT[0] if SEED_STUDENTS_IN_REPORT else None
        )
        return student

    def get_student_history(self, student_uuid: str) -> List[dict]:
        return SEED_STUDENT_HISTORY

    def add_report(self, report_data: dict) -> dict:
        all_reports = self._load_all()
        # Remove duplicate if same id
        all_reports = [r for r in all_reports if r.get("id") != report_data.get("id")]
        all_reports.insert(0, report_data)
        self._save_all(all_reports)
        return report_data

    def archive_report(self, report_id: str) -> bool:
        all_reports = self._load_all()
        found = False
        for r in all_reports:
            if r.get("id") == report_id:
                r["isArchived"] = True
                r["status"] = "archived"
                found = True
                break
        if found:
            self._save_all(all_reports)
        return found

    def restore_report(self, report_id: str) -> bool:
        all_reports = self._load_all()
        found = False
        for r in all_reports:
            if r.get("id") == report_id:
                r["isArchived"] = False
                r["status"] = "completed"
                found = True
                break
        if found:
            self._save_all(all_reports)
        return found

    def delete_report(self, report_id: str) -> bool:
        all_reports = self._load_all()
        new_reports = [r for r in all_reports if r.get("id") != report_id]
        if len(new_reports) < len(all_reports):
            self._save_all(new_reports)
            return True
        return False
