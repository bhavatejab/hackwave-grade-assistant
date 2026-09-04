from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from app.services.pdf_service import pdf_to_images
from app.services.ocr_service import extract_text_from_image
from app.services.question_service import (
    split_text_by_questions,
    group_page_sections,
)


# Number of PDF pages processed at the same time.
# 3 is a safe starting point.
MAX_WORKERS = 3


def process_single_page(page: dict, total_pages: int) -> dict:
    """
    Process one PDF page.

    This function:
    1. Runs OCR and visual analysis.
    2. Detects questions on the page.
    3. Returns the complete page result.
    """

    page_number = page["page_number"]
    page_path = page["path"]

    print(
        f"Processing page {page_number} "
        f"of {total_pages}..."
    )

    # Run OCR + visual understanding.
    ocr_result = extract_text_from_image(
        page_path
    )

    # Detect question sections.
    sections = split_text_by_questions(
        ocr_result["text"]
    )

    return {
        "page_number": page_number,
        "original_file": page_path,
        "processed_file": ocr_result[
            "processed_file"
        ],
        "image_width": ocr_result[
            "image_width"
        ],
        "image_height": ocr_result[
            "image_height"
        ],
        "sections": sections,
        "visual_content": ocr_result[
            "visual_content"
        ],
        "has_visual_content": ocr_result[
            "has_visual_content"
        ],
    }


def extract_text_from_pdf(
    pdf_path: str | Path,
) -> dict:
    """
    Convert every PDF page to an image and run OCR.

    Multiple pages are processed concurrently to reduce
    total processing time.

    The final results are sorted back into page order.

    The service preserves:
    - page number
    - original page image
    - processed image
    - OCR text
    - visual/diagram content
    - question number
    - cross-page question continuation
    """

    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {pdf_path}"
        )

    # --------------------------------------------------
    # STEP 1: Convert PDF pages into images
    # --------------------------------------------------

    pages = pdf_to_images(
        pdf_path,
        output_dir="tmp/pdf_pages",
    )

    total_pages = len(pages)

    # --------------------------------------------------
    # STEP 2: Process pages concurrently
    # --------------------------------------------------

    page_results = []

    print(
        f"Starting OCR for {total_pages} pages "
        f"using up to {MAX_WORKERS} workers..."
    )

    with ThreadPoolExecutor(
        max_workers=MAX_WORKERS
    ) as executor:

        future_to_page = {
            executor.submit(
                process_single_page,
                page,
                total_pages,
            ): page
            for page in pages
        }

        for future in as_completed(
            future_to_page
        ):

            page = future_to_page[future]

            try:
                result = future.result()
                page_results.append(result)

            except Exception as exc:
                page_number = page[
                    "page_number"
                ]

                raise RuntimeError(
                    f"OCR failed on page "
                    f"{page_number}: {exc}"
                ) from exc

    # --------------------------------------------------
    # STEP 3: Restore original page order
    # --------------------------------------------------

    page_results.sort(
        key=lambda item: item[
            "page_number"
        ]
    )

    # --------------------------------------------------
    # STEP 4: Group text sections across pages
    # --------------------------------------------------

    grouped_page_results = []

    current_question = None

    for page in page_results:

        grouped_sections, current_question = (
            group_page_sections(
                page["sections"],
                current_question,
            )
        )

        page["sections"] = grouped_sections

        grouped_page_results.append(
            page
        )

    page_results = grouped_page_results

    # --------------------------------------------------
    # STEP 5: Build question-level results
    # --------------------------------------------------

    questions = {}

    for page in page_results:

        for section in page["sections"]:

            question_number = section[
                "question_number"
            ]

            # Ignore content before the first
            # detected question.
            if question_number is None:
                continue

            # Create question if needed.
            if question_number not in questions:

                questions[question_number] = {
                    "question_number":
                        question_number,
                    "pages": [],
                    "content": [],
                }

            question = questions[
                question_number
            ]

            # Add page number.
            if page["page_number"] not in (
                question["pages"]
            ):
                question["pages"].append(
                    page["page_number"]
                )

            # Add text.
            question["content"].append(
                {
                    "page_number":
                        page["page_number"],
                    "type": "text",
                    "content":
                        section["text"],
                }
            )

    # --------------------------------------------------
    # STEP 6: Associate visual content
    # --------------------------------------------------

    active_question = None

    for page in page_results:

        page_question_numbers = [
            section["question_number"]
            for section in page["sections"]
            if section["question_number"]
            is not None
        ]

        previous_active_question = (
            active_question
        )

        visual_question = None

        # ----------------------------------------------
        # Page contains question numbers
        # ----------------------------------------------

        if page_question_numbers:

            first_question_on_page = (
                page_question_numbers[0]
            )

            # If a new question starts on this page,
            # conservatively associate page-level visual
            # content with the previous active question.
            #
            # Example:
            #
            # Page 8 -> Q8
            # Page 9 -> diagram + Q9
            #
            # Diagram -> Q8
            if (
                previous_active_question
                is not None
                and first_question_on_page
                != previous_active_question
            ):

                visual_question = (
                    previous_active_question
                )

            else:

                visual_question = (
                    first_question_on_page
                )

        # ----------------------------------------------
        # No question detected on this page
        # ----------------------------------------------

        else:

            visual_question = (
                active_question
            )

        # ----------------------------------------------
        # Update active question
        # ----------------------------------------------

        if page_question_numbers:

            active_question = (
                page_question_numbers[-1]
            )

        # ----------------------------------------------
        # Add visual content
        # ----------------------------------------------

        if (
            page["has_visual_content"]
            and visual_question is not None
        ):

            if visual_question not in questions:

                questions[visual_question] = {
                    "question_number":
                        visual_question,
                    "pages": [],
                    "content": [],
                }

            question = questions[
                visual_question
            ]

            if page["page_number"] not in (
                question["pages"]
            ):
                question["pages"].append(
                    page["page_number"]
                )

            question["content"].append(
                {
                    "page_number":
                        page["page_number"],
                    "type": "diagram",
                    "content":
                        page["visual_content"],
                }
            )

    # --------------------------------------------------
    # STEP 7: Sort questions
    # --------------------------------------------------

    question_list = sorted(
        questions.values(),
        key=lambda item:
            item["question_number"],
    )

    # --------------------------------------------------
    # STEP 8: Sort content within each question
    # --------------------------------------------------

    for question in question_list:

        question["content"].sort(
            key=lambda item: (
                item["page_number"],
                0 if item["type"] == "text"
                else 1,
            )
        )

        question["pages"].sort()

    # --------------------------------------------------
    # STEP 9: Create combined representation
    # --------------------------------------------------

    combined_parts = []

    for question in question_list:

        combined_parts.append(
            f"--- QUESTION "
            f"{question['question_number']} ---"
        )

        for content in question[
            "content"
        ]:

            combined_parts.append(
                f"[PAGE "
                f"{content['page_number']}] "
                f"{content['type'].upper()}\n"
                f"{content['content']}"
            )

    combined_text = "\n\n".join(
        combined_parts
    )

    # --------------------------------------------------
    # STEP 10: Return final result
    # --------------------------------------------------

    return {
        "source_file": pdf_path.name,
        "total_pages": total_pages,
        "pages": page_results,
        "questions": question_list,
        "combined_text": combined_text,
    }