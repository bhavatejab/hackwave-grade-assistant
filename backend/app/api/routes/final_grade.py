from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

from app.services.final_grade_service import FinalGradeService


router = APIRouter(
    prefix="/api",
    tags=["Final Grade"]
)


class FinalGradeRequest(BaseModel):
    criteria: List[dict]
    criterion_id: str
    teacher_final_score: float


class FinalGradeResponse(BaseModel):
    total_score: float
    max_score: float
    criteria: List[dict]


@router.post(
    "/final-grade",
    response_model=FinalGradeResponse
)
def calculate_final_grade(request: FinalGradeRequest):

    return FinalGradeService.calculate_final_grade(
        original_criteria=request.criteria,
        criterion_id=request.criterion_id,
        final_criterion_score=request.teacher_final_score
    )