from fastapi import FastAPI

from app.routes.ocr_routes import router as ocr_router


app = FastAPI(
    title="Smart Grade Assistant - OCR Service",
    description="Handwritten answer OCR and visual extraction service",
    version="1.0.0",
)


app.include_router(ocr_router)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "OCR service is running",
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "service": "ocr",
        "status": "healthy",
    }