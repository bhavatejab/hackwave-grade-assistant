from fastapi import APIRouter

from app.models.grading import (
    FeedbackRequest,
    FeedbackResponse
)

from app.services.feedback_service import FeedbackService


router = APIRouter(
    prefix="/api",
    tags=["Teacher Feedback"]
)


feedback_service = FeedbackService()


@router.post(
    "/feedback",
    response_model=FeedbackResponse
)
def save_feedback(
    request: FeedbackRequest
):

    return feedback_service.save_feedback(request)