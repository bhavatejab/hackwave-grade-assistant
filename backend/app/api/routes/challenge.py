from fastapi import APIRouter

from app.models.grading import (
    ChallengeRequest,
    ChallengeResponse
)

from app.services.challenge_service import ChallengeService


router = APIRouter(
    prefix="/api",
    tags=["Challenge AI"]
)


challenge_service = ChallengeService()


@router.post(
    "/challenge",
    response_model=ChallengeResponse
)
def challenge_grade(
    request: ChallengeRequest
):

    return challenge_service.challenge_grade(request)