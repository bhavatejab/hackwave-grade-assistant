def create_error_response(
    error_type: str,
    message: str,
    details: str | None = None,
) -> dict:
    """
    Create a consistent error response for the OCR system.
    """

    response = {
        "success": False,
        "error_type": error_type,
        "message": message,
    }

    if details:
        response["details"] = details

    return response


def handle_ocr_error(
    exception: Exception,
) -> dict:
    """
    Convert common OCR exceptions into
    user-friendly error responses.
    """

    if isinstance(
        exception,
        FileNotFoundError,
    ):
        return create_error_response(
            error_type="FILE_NOT_FOUND",
            message="The uploaded file could not be found.",
            details=str(exception),
        )

    if isinstance(
        exception,
        ValueError,
    ):
        return create_error_response(
            error_type="INVALID_FILE",
            message="The uploaded file is invalid or unsupported.",
            details=str(exception),
        )

    if isinstance(
        exception,
        RuntimeError,
    ):
        return create_error_response(
            error_type="PROCESSING_ERROR",
            message="The OCR system could not process the file.",
            details=str(exception),
        )

    return create_error_response(
        error_type="UNKNOWN_ERROR",
        message="An unexpected error occurred during OCR processing.",
        details=str(exception),
    )