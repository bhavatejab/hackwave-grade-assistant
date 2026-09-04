# OCR & Answer Reader

## Responsibility

This module converts student handwritten answer images/PDFs into
machine-readable and structured content for the Smart Grade Assistant.

The OCR module is responsible for reading and structuring student answers.
It does **not** perform grading or calculate marks.

---

## Input

The OCR module accepts:

- Student handwritten answer images
- Student answer PDFs
- Multi-page answer documents

Supported image formats:

- JPG
- JPEG
- PNG
- WEBP

Maximum supported file size:

- 20 MB

---

## Output

The OCR service returns structured JSON containing:

- Extracted student answer text
- Question sections
- Text content blocks
- Diagrams
- Tables
- Equations
- OCR confidence
- Processing information

Example:

```json
{
  "success": true,
  "source_file": "student_answer_01.jpeg",
  "text": "Extracted student answer...",
  "ocr_confidence": 0.92,
  "ocr_confidence_percent": 92,
  "ocr_confidence_level": "HIGH"
}