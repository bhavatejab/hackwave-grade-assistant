from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import grading
from app.api.routes import challenge
from app.api.routes import feedback
from app.api.routes import final_grade
from app.api.routes import reports
from app.api.routes import analytics
from app.api.routes import students
from app.api.routes import evaluations


app = FastAPI(
    title="Smart Grade Assistant API",
    description="AI-powered grading backend",
    version="1.0.0"
)

# CORS configuration for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register core AI grading routes
app.include_router(grading.router)
app.include_router(challenge.router)
app.include_router(feedback.router)
app.include_router(final_grade.router)

# Register new data/workflow routes
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(students.router)
app.include_router(evaluations.router)


# Health check
@app.get("/health")
def health_check():
    from app.core import config
    return {
        "status": "ok",
        "service": "Smart Grade Assistant",
        "featherless_api_key_configured": bool(config.FEATHERLESS_API_KEY)
    }