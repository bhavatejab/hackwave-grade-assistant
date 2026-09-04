from fastapi import APIRouter

from app.services.analytics_service import AnalyticsService


router = APIRouter(prefix="/api", tags=["Analytics"])
analytics_service = AnalyticsService()


@router.get("/analytics")
def get_analytics():
    """Return analytics overview computed from report data."""
    return analytics_service.get_analytics()
