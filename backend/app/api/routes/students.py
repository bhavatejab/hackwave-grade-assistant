from fastapi import APIRouter
from typing import List

from app.services.student_service import StudentService
from app.services.report_service import ReportService
from app.models.reports import StudentRecord


router = APIRouter(prefix="/api", tags=["Students"])
student_service = StudentService()
report_service = ReportService()


@router.get("/students", response_model=List[StudentRecord])
def get_students():
    """Return the student roster."""
    return student_service.get_students()


@router.get("/student-history/{student_uuid}")
def get_student_history(student_uuid: str):
    """Return grading history for a specific student UUID."""
    return report_service.get_student_history(student_uuid)
