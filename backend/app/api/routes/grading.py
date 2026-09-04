from fastapi import APIRouter, HTTPException

from app.models.grading import GradeRequest, GradeResponse
from app.services.grading_service import GradingService


router = APIRouter(prefix="/api", tags=["Grading"])

grading_service = GradingService()


@router.post("/grade", response_model=GradeResponse)
def grade_answer(request: GradeRequest):
    try:
        return grading_service.grade_answer(request)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))