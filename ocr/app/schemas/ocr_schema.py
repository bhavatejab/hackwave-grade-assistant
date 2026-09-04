from pydantic import BaseModel, Field


class ContentBlock(BaseModel):
    block_number: int
    type: str
    content: str


class QuestionSection(BaseModel):
    """
    Represents one student-answer question and its parent section.

    Example:
        Section II
            Q5
                Answer / Table / Diagram
    """

    # Actual section identifier from the question paper.
    # Examples: "I", "II", "A", "B", "Section I"
    section_label: str = "NONE"

    # Kept optional for backward compatibility.
    # This should represent the actual section number when known,
    # NOT the position of this question in the extracted list.
    section_number: int | None = None

    # Question belonging to the section.
    question_number: int | None = None

    # Subquestion belonging to the parent question.
    subquestion_label: str = "NONE"

    # Subpoint belonging to the parent question/subquestion.
    subpoint_label: str = "NONE"

    content_blocks: list[ContentBlock] = Field(
        default_factory=list
    )


class VisualItem(BaseModel):
    question_number: int | None = None

    subquestion_label: str = "NONE"

    subpoint_label: str = "NONE"

    type: str

    content: str


class FileValidation(BaseModel):
    valid: bool

    filename: str

    extension: str

    size_bytes: int

    size_mb: float


class OCRResponse(BaseModel):
    success: bool

    source_file: str

    validation: FileValidation

    processed_file: str

    image_width: int

    image_height: int

    text: str

    visual_content: str

    visual_items: list[VisualItem]

    has_visual_content: bool

    # First/main question number when applicable.
    question_number: int | None = None

    # All detected question numbers.
    question_numbers: list[int] = Field(
        default_factory=list
    )

    # Structured student-answer questions.
    #
    # Each question keeps its parent section through
    # QuestionSection.section_label.
    question_sections: list[QuestionSection] = Field(
        default_factory=list
    )

    # All content blocks extracted from the page.
    content_blocks: list[ContentBlock] = Field(
        default_factory=list
    )

    ocr_confidence: float

    ocr_confidence_percent: int

    ocr_confidence_level: str

    confidence_reasons: list[str] = Field(
        default_factory=list
    )

    raw_result: str