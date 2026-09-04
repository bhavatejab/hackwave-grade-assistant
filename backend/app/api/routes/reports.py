from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.services.report_service import ReportService
from app.models.reports import (
    ReportSummary,
    EvaluationReportDetail,
    StudentEvaluationReport,
    PaginatedReportsResponse,
    ArchiveRequest,
    AddReportRequest,
)


router = APIRouter(prefix="/api", tags=["Reports"])
report_service = ReportService()


@router.get("/reports", response_model=PaginatedReportsResponse)
def get_reports(
    is_archived: bool = Query(False, alias="isArchived"),
    search: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("date", alias="sortBy"),
    sort_order: str = Query("desc", alias="sortOrder"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    result = report_service.get_reports(
        is_archived=is_archived,
        search=search,
        subject=subject,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )
    return result


@router.post("/reports", response_model=ReportSummary)
def add_report(body: AddReportRequest):
    """Add a newly finalized report to the store."""
    saved = report_service.add_report(body.model_dump())
    return saved


@router.get("/reports/student/{student_uuid}")
def get_student_report_by_uuid(student_uuid: str):
    """Get a student evaluation report by their UUID."""
    student = report_service.get_student_report("", student_uuid)
    if not student:
        raise HTTPException(status_code=404, detail="Student report not found")
    return student


@router.get("/reports/{report_id}")
def get_report_by_id(report_id: str):
    """Get full evaluation report detail for a specific report."""
    report = report_service.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/reports/archive")
def archive_report(body: ArchiveRequest):
    """Archive a report by ID."""
    success = report_service.archive_report(body.id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True, "id": body.id}


@router.post("/reports/restore")
def restore_report(body: ArchiveRequest):
    """Restore an archived report by ID."""
    success = report_service.restore_report(body.id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True, "id": body.id}


@router.delete("/reports/{report_id}")
def delete_report(report_id: str):
    """Permanently delete a report by ID."""
    success = report_service.delete_report(report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True, "id": report_id}


@router.get("/student-history/{student_uuid}")
def get_student_history(student_uuid: str):
    """Get grading history for a specific student UUID."""
    history = report_service.get_student_history(student_uuid)
    return history
