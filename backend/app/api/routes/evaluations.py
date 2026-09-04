from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from app.services.evaluation_workflow_service import EvaluationWorkflowService
from app.services.report_service import ReportService
from app.models.reports import (
    CreateEvaluationRequest,
    EvaluationRecord,
    UploadedFileRecord,
    EvaluationStatusResponse,
    DashboardSummary,
)


router = APIRouter(prefix="/api", tags=["Evaluation Workflow"])

# Singletons shared within the process
_workflow_service = EvaluationWorkflowService()
_report_service = ReportService()


@router.post("/evaluations", response_model=EvaluationRecord)
def create_evaluation(body: CreateEvaluationRequest):
    """Create a new evaluation draft record."""
    record = _workflow_service.create_evaluation(body)
    return record


@router.get("/evaluations")
def list_evaluations():
    """List all in-session evaluation records."""
    return _workflow_service.list_evaluations()


@router.get("/evaluation/status", response_model=EvaluationStatusResponse)
def get_evaluation_status():
    """Return processing pipeline status."""
    return _workflow_service.get_evaluation_status()


# -------------------------------------------------------
# File Upload Endpoints
# Note: We store metadata only (no OCR processing here).
# Real OCR can be wired in as a separate service later.
# -------------------------------------------------------

@router.post("/upload/question-paper", response_model=UploadedFileRecord)
async def upload_question_paper(file: UploadFile = File(...)):
    """Register a question paper file upload."""
    content = await file.read()
    record = _workflow_service.record_upload(
        filename=file.filename or "question_paper",
        filesize=len(content),
        filetype=file.content_type or "application/octet-stream",
        upload_kind="question-paper",
    )
    return record


@router.post("/upload/rubric", response_model=UploadedFileRecord)
async def upload_rubric(file: UploadFile = File(...)):
    """Register a rubric file upload."""
    content = await file.read()
    record = _workflow_service.record_upload(
        filename=file.filename or "rubric",
        filesize=len(content),
        filetype=file.content_type or "application/octet-stream",
        upload_kind="rubric",
    )
    return record


@router.post("/upload/student-answer", response_model=UploadedFileRecord)
async def upload_student_answer(file: UploadFile = File(...)):
    """Register a student answer file upload and assign anonymous UUID."""
    content = await file.read()
    record = _workflow_service.record_upload(
        filename=file.filename or "student_answer",
        filesize=len(content),
        filetype=file.content_type or "application/octet-stream",
        upload_kind="student-answer",
    )
    return record


@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    """Return dashboard summary statistics computed from reports."""
    return _workflow_service.get_dashboard_summary(_report_service)
