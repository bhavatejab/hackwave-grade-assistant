from fastapi import FastAPI

app = FastAPI(
    title="Smart Grade Assistant API",
    description="AI-powered grading backend",
    version="1.0.0"
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Smart Grade Assistant"
    }