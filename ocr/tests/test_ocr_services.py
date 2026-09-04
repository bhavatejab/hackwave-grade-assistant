from pathlib import Path

import pytest

from app.services.file_validation_service import validate_file
from app.services.preprocessing_service import preprocess_image
from app.services.confidence_service import calculate_ocr_confidence
from app.services.error_handler_service import handle_ocr_error


SAMPLE_IMAGE = Path(
    "uploads/student_answer_01.jpeg"
)


def test_valid_image_file():
    result = validate_file(
        SAMPLE_IMAGE
    )

    assert result["valid"] is True
    assert result["extension"] == ".jpeg"


def test_invalid_file_format(tmp_path):
    test_file = tmp_path / "test.txt"

    test_file.write_text(
        "This is an invalid file format.",
        encoding="utf-8",
    )

    with pytest.raises(ValueError):
        validate_file(test_file)


def test_image_preprocessing(tmp_path):
    output_path = (
        tmp_path / "test_processed.png"
    )

    result = preprocess_image(
        SAMPLE_IMAGE,
        output_path,
    )

    assert output_path.exists()
    assert result["format"] == "PNG"
    assert result["grayscale"] is True


def test_high_confidence():
    result = calculate_ocr_confidence(
        "This is a clear handwritten answer."
    )

    assert 0 <= result["confidence"] <= 1

    assert result["level"] in {
        "HIGH",
        "MEDIUM",
        "LOW",
    }


def test_unclear_content_reduces_confidence():
    result = calculate_ocr_confidence(
        "This is an answer [UNCLEAR] with "
        "[UNCLEAR] regions."
    )

    assert result["confidence"] < 1
    assert len(result["reasons"]) > 0


def test_file_not_found_error():
    missing_file = Path(
        "uploads/does_not_exist.jpeg"
    )

    with pytest.raises(
        FileNotFoundError
    ):
        validate_file(
            missing_file
        )


def test_error_handler():
    error = ValueError(
        "Unsupported file format: .txt"
    )

    result = handle_ocr_error(
        error
    )

    assert result["success"] is False
    assert result["error_type"] == (
        "INVALID_FILE"
    )