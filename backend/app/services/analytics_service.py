from app.services.report_service import ReportService
from app.models.reports import AnalyticsOverview


# Static seed analytics data (can be made dynamic from reports in the future)
SEED_ANALYTICS = {
    "totalEvaluations": 243,
    "averageScore": 84.7,
    "averageConfidence": 93.8,
    "manualReviewsCount": 25,
    "teacherOverridesCount": 17,
    "autoGradedPercentage": 89.7,
    "monthlyEvaluations": [
        {"month": "Apr", "count": 18},
        {"month": "May", "count": 32},
        {"month": "Jun", "count": 45},
        {"month": "Jul", "count": 52},
        {"month": "Aug", "count": 68},
        {"month": "Sep", "count": 28},
    ],
    "confidenceTrend": [
        {"date": "Aug 1", "confidence": 91.2},
        {"date": "Aug 8", "confidence": 92.5},
        {"date": "Aug 15", "confidence": 93.1},
        {"date": "Aug 22", "confidence": 94.8},
        {"date": "Aug 29", "confidence": 95.4},
        {"date": "Sep 3", "confidence": 96.2},
    ],
    "marksTrend": [
        {"date": "Aug 1", "avgScore": 81.0},
        {"date": "Aug 8", "avgScore": 83.2},
        {"date": "Aug 15", "avgScore": 84.5},
        {"date": "Aug 22", "avgScore": 85.0},
        {"date": "Aug 29", "avgScore": 86.8},
        {"date": "Sep 3", "avgScore": 87.4},
    ],
    "subjectPerformance": [
        {"subject": "Computer Science", "avgScore": 87.2, "count": 92},
        {"subject": "Physics", "avgScore": 79.5, "count": 65},
        {"subject": "Mathematics", "avgScore": 83.8, "count": 54},
        {"subject": "English", "avgScore": 90.1, "count": 32},
    ],
    "manualReviewDistribution": [
        {"category": "Low Confidence (<75%)", "count": 14, "color": "#ef4444"},
        {"category": "Ambiguous Handwriting", "count": 6, "color": "#f59e0b"},
        {"category": "Rubric Alternative Match", "count": 5, "color": "#3b82f6"},
    ],
    "autoVsManual": [
        {"month": "May", "autoGraded": 29, "manualReview": 3},
        {"month": "Jun", "autoGraded": 40, "manualReview": 5},
        {"month": "Jul", "autoGraded": 46, "manualReview": 6},
        {"month": "Aug", "autoGraded": 61, "manualReview": 7},
        {"month": "Sep", "autoGraded": 24, "manualReview": 4},
    ],
    "questionDifficulty": [
        {"questionNum": "Q1 (BST Lookup)", "avgScore": 19.2, "maxScore": 20, "difficulty": "Easy"},
        {"questionNum": "Q2 (Stack vs Heap)", "avgScore": 18.5, "maxScore": 20, "difficulty": "Easy"},
        {"questionNum": "Q3 (Matrix Multiplication)", "avgScore": 14.8, "maxScore": 20, "difficulty": "Hard"},
        {"questionNum": "Q4 (Thread Synchronization)", "avgScore": 16.1, "maxScore": 20, "difficulty": "Medium"},
        {"questionNum": "Q5 (Virtual Memory)", "avgScore": 17.0, "maxScore": 20, "difficulty": "Medium"},
    ],
}


class AnalyticsService:

    def __init__(self):
        self.report_service = ReportService()

    def get_analytics(self) -> dict:
        """
        Return analytics overview. Computes live stats from report data
        and augments with seed trend/chart data.
        """
        active = self.report_service.get_reports(is_archived=False, limit=1000)
        archived = self.report_service.get_reports(is_archived=True, limit=1000)
        all_reports = active["reports"] + archived["reports"]

        if all_reports:
            total = len(all_reports)
            avg_score = round(
                sum(r.get("averageScore", 0) for r in all_reports) / total, 1
            ) if total else 0
            avg_conf = round(
                sum(r.get("averageConfidence", 0) for r in all_reports) / total, 1
            ) if total else 0
            total_reviews = sum(r.get("manualReviewsCount", 0) for r in all_reports)
            total_overrides = sum(r.get("teacherOverridesCount", 0) for r in all_reports)

            # Auto-graded percentage: (total students - manual reviews) / total students
            total_students = sum(r.get("studentCount", 0) for r in all_reports) or 1
            auto_pct = round(max(0, (total_students - total_reviews) / total_students * 100), 1)

            # Build subject performance from actual reports
            subject_map: dict = {}
            for r in all_reports:
                subj = r.get("subject", "Other")
                if subj not in subject_map:
                    subject_map[subj] = {"total": 0, "count": 0}
                subject_map[subj]["total"] += r.get("averageScore", 0)
                subject_map[subj]["count"] += 1

            subject_perf = [
                {
                    "subject": s,
                    "avgScore": round(v["total"] / v["count"], 1),
                    "count": v["count"],
                }
                for s, v in subject_map.items()
            ]

            return {
                **SEED_ANALYTICS,
                "totalEvaluations": total,
                "averageScore": avg_score,
                "averageConfidence": avg_conf,
                "manualReviewsCount": total_reviews,
                "teacherOverridesCount": total_overrides,
                "autoGradedPercentage": auto_pct,
                "subjectPerformance": subject_perf if subject_perf else SEED_ANALYTICS["subjectPerformance"],
            }

        return SEED_ANALYTICS
