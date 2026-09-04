from pathlib import Path


SUPPORTED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

SUPPORTED_EXTENSIONS = (
    SUPPORTED_IMAGE_EXTENSIONS
    | {".pdf"}
)

MAX_FILE_SIZE_MB = 20
MAX_FILE_SIZE_BYTES = (
    MAX_FILE_SIZE_MB * 1024 * 1024
)


def validate_file(
    file_path: str | Path,
) -> dict:
    """
    Validate an uploaded student answer file.

    Checks:
    - File exists
    - File extension is supported
    - File size is within the limit
    """

    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    extension = file_path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}. "
            f"Supported formats: JPG, JPEG, PNG, WEBP, PDF."
        )

    file_size = file_path.stat().st_size

    if file_size == 0:
        raise ValueError(
            "The uploaded file is empty."
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        raise ValueError(
            f"File is too large. "
            f"Maximum allowed size is "
            f"{MAX_FILE_SIZE_MB} MB."
        )

    return {
        "valid": True,
        "filename": file_path.name,
        "extension": extension,
        "size_bytes": file_size,
        "size_mb": round(
            file_size / (1024 * 1024),
            2,
        ),
    }