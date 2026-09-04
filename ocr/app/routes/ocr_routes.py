from pathlib import Path
import shutil

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.ocr_schema import OCRResponse
from app.services.error_handler_service import handle_ocr_error
from app.services.ocr_service import extract_text_from_image


router = APIRouter(
    prefix="/ocr",
    tags=["OCR"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


@router.post(
    "/extract",
    response_model=OCRResponse,
)
async def extract_ocr(
    file: UploadFile = File(...),
):
    """
    Receive a student answer image and
    return structured OCR information.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was uploaded.",
        )

    file_extension = Path(
        file.filename
    ).suffix.lower()

    supported_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    if file_extension not in supported_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Please upload JPG, JPEG, PNG, "
                "or WEBP."
            ),
        )

    safe_filename = Path(
        file.filename
    ).name

    file_path = (
        UPLOAD_DIR / safe_filename
    )

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

        result = extract_text_from_image(
            file_path
        )

        return result

    except Exception as exc:
        error_response = handle_ocr_error(
            exc
        )

        raise HTTPException(
            status_code=500,
            detail=error_response,
        )

    finally:
        await file.close()