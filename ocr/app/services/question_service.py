import re


# Supports formats such as:
#
# 1.
# 2)
# 3:
# Q4.
# Question 5.
# QUESTION: 6
#
# Also supports:
#
# QUESTION:
# 7
#
QUESTION_PATTERN = re.compile(
    r"""
    (?im)
    ^\s*
    (?:
        Q(?:uestion)?\s*[:\-]?\s*
    )?
    (\d+)
    \s*[\.\):\-]?
    \s*$
    """,
    re.VERBOSE,
)


def detect_question_numbers(text: str) -> list[int]:
    """
    Detect question numbers from OCR text.

    Examples:

        1.
        2)
        3:
        Q4.
        Question 5.
        QUESTION: 6
        QUESTION:
        7
    """

    if not text:
        return []

    matches = QUESTION_PATTERN.findall(text)

    return [
        int(number)
        for number in matches
    ]


def find_question_positions(text: str) -> list[dict]:
    """
    Find each question number and its position
    inside the OCR text.
    """

    if not text:
        return []

    results = []

    for match in QUESTION_PATTERN.finditer(text):

        results.append(
            {
                "question_number": int(
                    match.group(1)
                ),
                "start": match.start(),
                "end": match.end(),
            }
        )

    return results


def split_text_by_questions(
    text: str,
) -> list[dict]:
    """
    Split OCR text into separate question sections.

    Content before the first detected question
    is stored as preamble.
    """

    if not text:
        return []

    positions = find_question_positions(text)

    if not positions:
        return [
            {
                "question_number": None,
                "text": text.strip(),
            }
        ]

    sections = []

    # --------------------------------------------------
    # Content before the first question
    # --------------------------------------------------

    if positions[0]["start"] > 0:

        preamble = text[
            :positions[0]["start"]
        ].strip()

        if preamble:

            sections.append(
                {
                    "question_number": None,
                    "text": preamble,
                }
            )

    # --------------------------------------------------
    # Split each question
    # --------------------------------------------------

    for index, position in enumerate(
        positions
    ):

        start = position["start"]

        if index + 1 < len(positions):

            end = positions[
                index + 1
            ]["start"]

        else:

            end = len(text)

        question_text = text[
            start:end
        ].strip()

        sections.append(
            {
                "question_number":
                    position[
                        "question_number"
                    ],
                "text": question_text,
            }
        )

    return sections


def group_page_sections(
    page_sections: list[dict],
    previous_question: int | None = None,
) -> tuple[list[dict], int | None]:
    """
    Assign page sections to the correct question.

    If a section has a question number,
    that question becomes the current question.

    If a section does not have a question number,
    it belongs to the most recently detected question.

    This allows answers to continue across pages.
    """

    grouped_sections = []

    current_question = previous_question

    for section in page_sections:

        question_number = section[
            "question_number"
        ]

        # A new question number was detected.
        if question_number is not None:

            current_question = (
                question_number
            )

        grouped_sections.append(
            {
                "question_number":
                    current_question,
                "text": section["text"],
            }
        )

    return (
        grouped_sections,
        current_question,
    )