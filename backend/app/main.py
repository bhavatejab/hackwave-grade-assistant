from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import grading
from app.api.routes import challenge
from app.api.routes import feedback
from app.api.routes import final_grade


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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(grading.router)
app.include_router(challenge.router)
app.include_router(feedback.router)
app.include_router(final_grade.router)


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Smart Grade Assistant"
    }