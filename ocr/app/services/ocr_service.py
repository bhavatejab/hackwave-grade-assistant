import base64
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from app.services.preprocessing_service import preprocess_image
from app.services.file_validation_service import validate_file
from app.services.confidence_service import calculate_ocr_confidence


load_dotenv()


FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1"

FEATHERLESS_API_KEY = os.getenv(
    "FEATHERLESS_API_KEY"
)

FEATHERLESS_MODEL = os.getenv(
    "FEATHERLESS_MODEL",
    "Qwen/Qwen3-VL-8B-Instruct",
)


if not FEATHERLESS_API_KEY:
    raise RuntimeError(
        "FEATHERLESS_API_KEY is missing from .env"
    )


client = OpenAI(
    base_url=FEATHERLESS_BASE_URL,
    api_key=FEATHERLESS_API_KEY,
)


def image_to_base64(
    image_path: str | Path,
) -> str:
    """
    Convert an image file into base64.
    """

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    with image_path.open("rb") as image_file:
        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def build_ocr_prompt() -> str:
    """
    Build the document-understanding prompt.
    """

    return """
You are a handwriting OCR and document-structure
understanding system.

Your ONLY job is to read the student's answer sheet.

Do NOT grade answers.
Do NOT calculate marks.
Do NOT correct spelling.
Do NOT improve grammar.
Do NOT judge whether an answer is correct.

==================================================
MAIN TASK
==================================================

Read the ENTIRE PAGE visually from top to bottom.

First understand the visual layout and hierarchy of
the page.

Then extract the student's handwritten content.

The possible hierarchy is:

STUDENT
  |
  +-- SECTION / PART / UNIT
        |
        +-- QUESTION
              |
              +-- SUBQUESTION
                    |
                    +-- SUBPOINT
                          |
                          +-- ANSWER / VISUAL

Not every document contains every level.

The number of sections, questions, subquestions,
subpoints, tables, diagrams, and answers is
DYNAMIC.

NEVER assume a fixed number of sections or questions.

==================================================
IMPORTANT: READ THE PAGE VISUALLY
==================================================

Do not rely only on OCR text recognition.

Use the visual position, spacing, indentation,
alignment, handwriting, headings, numbering,
borders, table lines, arrows, and surrounding content
to understand the document structure.

Before producing the structured output, mentally
inspect the complete page.

Pay special attention to headings at the top,
center, left, or above groups of questions.

==================================================
SECTION / PART / UNIT DETECTION
==================================================

Identify TOP-LEVEL headings that group questions.

Possible examples:

Part A
Part B
Part I
Part II
Part III

Section A
Section B
Section I
Section II
Section III

Unit 1
Unit 2
Unit 3

I
II
III

I)
II)
III)

A
B
C

A)
B)
C)

Preserve the original visible label.

If the page visibly contains:

I

output:

SECTION:
I

If the page visibly contains:

II

output:

SECTION:
II

If the page visibly contains:

Part A

output:

SECTION:
Part A

If the page visibly contains:

Section II

output:

SECTION:
Section II

Do NOT convert labels.

For example:

II must remain II.

Part B must remain Part B.

Section II must remain Section II.

Do NOT invent a section.

==================================================
CRITICAL SECTION RULE
==================================================

Before returning:

SECTION:
NONE

carefully inspect the entire page for a visible
section, part, or unit heading.

If a clear top-level heading is visible, identify it.

Use:

SECTION:
NONE

ONLY when there is genuinely no visible or
reasonably identifiable section/part/unit heading.

Do NOT return SECTION: NONE simply because the
heading is handwritten, faint, near the page edge,
above the first question, or visually separated from
the answer text.

==================================================
SECTION CONTINUATION ACROSS PAGES
==================================================

A question may continue across multiple pages.

A section may also continue across multiple pages.

If the current page visibly begins a new section,
identify that new section.

Example:

PAGE 1:

SECTION:
I

QUESTION:
1

...

QUESTION:
2

...

QUESTION:
3

...

PAGE 2:

SECTION:
II

QUESTION:
4

...

QUESTION:
5

...

Then page 2 must output:

SECTION:
II

QUESTION:
4

...

QUESTION:
5

...

Do NOT output:

SECTION:
NONE

when SECTION II is visibly present.

Do NOT invent a section simply because question
numbers increase.

==================================================
DISTINGUISH SECTION FROM QUESTION
==================================================

A section heading groups questions.

A question is an individual answerable item.

For example:

II

4) An entrepreneur is...

5) Differentiate between UI and UX.

means:

SECTION:
II

QUESTION:
4

...

QUESTION:
5

...

The "II" is the section.

The "4" and "5" are questions.

Do not treat the section heading as a question.

Do not treat a question number as a section.

==================================================
DISTINGUISH PEER QUESTIONS
==================================================

A sequence such as:

1)
2)
3)

does NOT automatically mean subquestions.

Look at the COMPLETE PAGE STRUCTURE.

If the document visually contains:

I)

1) Entrepreneurship is...
2) Before developing a solution...
3) Human-centered Design is...

then 1, 2, and 3 are PEER QUESTIONS under
section I.

Output:

SECTION:
I

QUESTION:
1

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Entrepreneurship is...

VISUAL:
NONE

QUESTION:
2

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Before developing a solution...

VISUAL:
NONE

QUESTION:
3

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Human-centered Design is...

VISUAL:
NONE

Do NOT output:

QUESTION:
1

SUBQUESTION:
1

SUBQUESTION:
2

SUBQUESTION:
3

unless the visual layout clearly shows that 1, 2,
and 3 are children of Question 1.

==================================================
NUMERIC LABELS
==================================================

Numeric labels can represent:

- peer questions
- subquestions
- subpoints
- table rows
- list items

Never classify a number using the symbol alone.

Use:

- visual position
- indentation
- alignment
- spacing
- surrounding headings
- numbering sequence
- question wording
- whether the item is independently answerable
- whether it belongs inside an existing question

If multiple numbered items appear at the same visual
level under a section, they are likely peer questions.

If a numbered item is visually nested inside an
existing question, it may be a subquestion or
subpoint.

==================================================
WHEN ITEMS ARE SUBQUESTIONS
==================================================

If the document contains:

Question 1

(a) Define HCD.
(b) Explain HCD principles.

then:

QUESTION:
1

SUBQUESTION:
(a)

ANSWER:
Define HCD.

SUBQUESTION:
(b)

ANSWER:
Explain HCD principles.

Do NOT convert (a) and (b) into Questions 2 and 3.

Similarly:

Question 1
(i) ...
(ii) ...

may represent subquestions if the visual layout
clearly shows that they belong inside Question 1.

==================================================
SUBQUESTIONS
==================================================

Preserve genuine subquestions.

Examples:

(a)
(b)

(i)
(ii)

a)
b)

1(a)
1(b)

1(a)(i)
1(a)(ii)

Determine their hierarchy from visual layout and
context.

Do not automatically treat every label as a
subquestion.

==================================================
SUBPOINTS
==================================================

Some labels are only points inside an answer.

Example:

Question 1

Explain HCD:

i) User research
ii) Prototyping

If these are explanatory points rather than
separately answerable questions, use:

SUBPOINT:
i

SUBPOINT:
ii

Do not automatically make every numbered item
a question.

==================================================
QUESTION DETECTION
==================================================

Detect all actual questions visible on the page.

Examples:

1.
1)
Q1
Q.1
Question 1

Also detect handwritten question numbers when
they are visually identifiable.

If the document visibly contains:

1)
2)
3)
4)
5)

as peer questions, output:

QUESTION:
1

QUESTION:
2

QUESTION:
3

QUESTION:
4

QUESTION:
5

Do not skip visible questions.

Do not invent questions.

The number of questions is dynamic.

==================================================
ANSWER EXTRACTION
==================================================

Extract the student's answer as accurately as possible.

Preserve:

- original wording
- spelling mistakes
- grammar mistakes
- symbols
- arrows
- mathematical notation
- abbreviations
- crossed-out content when readable
- handwritten labels
- numbering inside answers

Do NOT correct spelling.

Do NOT rewrite grammar.

Do NOT summarize the student's answer.

Do NOT add information that is not visible.

Use [UNCLEAR] only when handwriting is genuinely
unreadable.

==================================================
TABLE DETECTION
==================================================

IMPORTANT:

A handwritten table is ONE visual structure
belonging to the current question.

Do NOT create a new question for every table row.

Do NOT create a new section for every table row.

Do NOT create multiple QUESTION records merely
because a table contains multiple cells.

Use the visible row and column relationships.

For example, if the question is:

QUESTION:
5

and the student draws a table comparing:

UI | UX

with multiple handwritten rows,

the entire table belongs to QUESTION 5.

The structure should conceptually be:

QUESTION:
5

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
<answer text if present>

VISUAL:
TABLE:
<preserve the row and column relationships>

If the table contains handwritten text, extract the
text while preserving which content belongs to which
column and row.

Example:

VISUAL:
TABLE:
UI | UX
Interface / appearance | Overall user experience
Product presentation | Usefulness and ease of use

Do NOT convert the table rows into:

QUESTION:
5

QUESTION:
5

QUESTION:
5

They are all part of the same answer.

==================================================
DIAGRAM DETECTION
==================================================

Detect diagrams, drawings, flowcharts, graphs,
figures, arrows, and other visual content.

Associate each visual with the correct:

SECTION
QUESTION
SUBQUESTION
SUBPOINT

For diagrams, provide a concise description of what
is visibly represented.

Do not invent missing labels.

==================================================
EQUATION DETECTION
==================================================

Detect handwritten mathematical equations.

Preserve mathematical structure as accurately
as possible.

Do not convert an equation into an unrelated
sentence.

If part of an equation is unreadable, use:

[UNCLEAR]

for that region.

==================================================
VISUAL CONTENT ASSOCIATION
==================================================

Every table, diagram, graph, equation, or drawing
must be associated with the question or subquestion
where it appears.

A visual does NOT create a new question.

A visual does NOT create a new section.

A table row does NOT create a new question.

A table column does NOT create a new question.

==================================================
STUDENT INFORMATION
==================================================

Find student information separately.

Examples:

Student A
Student B
Name: Student A
Roll No: 1234
Register Number: ABC123

Output:

STUDENT:
Student A

or:

STUDENT:
Student A
Roll No: 1234

If no student information is visible:

STUDENT:
UNKNOWN

Do not put student information inside an answer.

==================================================
CRITICAL EXAMPLE: SECTION I
==================================================

If the page visually contains:

Student A

I

1) Entrepreneurship is...

2) Before developing a solution...

3) Human-centered Design is...

the correct interpretation is:

STUDENT:
Student A

SECTION:
I

QUESTION:
1

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Entrepreneurship is...

VISUAL:
NONE

QUESTION:
2

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Before developing a solution...

VISUAL:
NONE

QUESTION:
3

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
Human-centered Design is...

VISUAL:
NONE

==================================================
CRITICAL EXAMPLE: SECTION II
==================================================

If another page visually contains:

II

4) An entrepreneur is a risk bearer...

5) Differentiate between UI and UX

then the correct interpretation is:

SECTION:
II

QUESTION:
4

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
An entrepreneur is a risk bearer...

VISUAL:
NONE

QUESTION:
5

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
<answer text if any>

VISUAL:
<table or visual table representation>

Do NOT output:

SECTION:
NONE

if II is visibly written on the page.

==================================================
CRITICAL EXAMPLE: UI AND UX TABLE
==================================================

If Question 5 contains a handwritten comparison
table with columns:

UI

UX

and rows describing the differences, the complete
table belongs to Question 5.

For example:

QUESTION:
5

SUBQUESTION:
NONE

SUBPOINT:
NONE

ANSWER:
<student's introductory answer if visible>

VISUAL:
TABLE:
UI | UX
<UI cell> | <UX cell>
<UI cell> | <UX cell>

Do NOT treat each row as a separate question.

Do NOT treat each column as a separate question.

Do NOT treat each row as a separate section.

==================================================
CRITICAL EXAMPLE: TWO TOP-LEVEL SECTIONS
==================================================

A complete answer sheet may contain:

SECTION I
    QUESTION 1
    QUESTION 2
    QUESTION 3

SECTION II
    QUESTION 4
    QUESTION 5

The correct hierarchy is:

SECTION:
I

QUESTION:
1
...

QUESTION:
2
...

QUESTION:
3
...

SECTION:
II

QUESTION:
4
...

QUESTION:
5
...

The number of sections is NOT fixed.

The number of questions per section is NOT fixed.

Never assume:

2 sections

5 questions

3 questions per section

or any other fixed number.

Infer the actual structure from the page.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY the following structured format.

STUDENT:
<student information or UNKNOWN>

SECTION:
<original section label or NONE>

QUESTION:
<number or label>

SUBQUESTION:
<label or NONE>

SUBPOINT:
<label or NONE>

ANSWER:
<answer text>

VISUAL:
<visual description, table, diagram, equation, or NONE>

Repeat the appropriate fields for every question,
subquestion, or answer item.

When multiple questions belong to the same section,
repeat the SECTION only when necessary to make the
hierarchy clear.

Do not add explanations outside this structure.

==================================================
IMPORTANT OUTPUT RULES
==================================================

1. Do not invent sections.

2. Do not invent questions.

3. Do not skip visible questions.

4. Do not turn table rows into questions.

5. Do not turn table columns into questions.

6. Do not turn diagrams into questions.

7. Do not turn answer points into questions unless
   the visual structure clearly indicates they are
   independently answerable.

8. Preserve section labels exactly.

9. Preserve question numbers exactly.

10. Preserve subquestion labels exactly.

11. Preserve subpoint labels exactly.

12. Preserve the student's original wording.

13. Preserve visual/table relationships.

14. Associate visual content with its parent question.

15. Use SECTION: NONE only when no section heading
    is visible or reasonably identifiable.

==================================================
FINAL VISUAL CHECK
==================================================

Before returning the result, mentally verify the
COMPLETE PAGE.

Check:

1. Did I identify the student?

2. Did I identify the top-level section/part/unit?

3. Did I inspect the page heading carefully?

4. Did I distinguish sections from questions?

5. Did I distinguish peer questions from
   subquestions?

6. Did I distinguish subquestions from subpoints?

7. Did I preserve the original labels?

8. Did I detect tables?

9. Did I preserve table row/column relationships?

10. Did I detect diagrams, equations, or graphs?

11. Did I associate visuals with the correct question?

12. Did I avoid creating duplicate questions?

13. Did I avoid creating duplicate sections?

14. Did I avoid inventing information?

The goal is:

HANDWRITING OCR
+
DOCUMENT STRUCTURE UNDERSTANDING
+
HIERARCHICAL ANSWER EXTRACTION
+
TABLE / DIAGRAM / EQUATION PRESERVATION

NOT grading.
"""
def parse_question_sections(
    raw_result: str,
) -> tuple[str, list[dict]]:
    """
    Parse the structured Featherless response.

    The parser preserves the hierarchy:

        SECTION
            QUESTION
                SUBQUESTION
                    SUBPOINT
                        ANSWER / VISUAL

    A structure item is created only when actual
    answer or visual content is available.

    The number of sections, questions, subquestions,
    and subpoints is completely dynamic.
    """

    if not raw_result:
        return "UNKNOWN", []

    lines = raw_result.splitlines()

    student_lines = []
    raw_items = []

    current_section = "NONE"
    current_question = None
    current_subquestion = "NONE"
    current_subpoint = "NONE"

    answer_lines = []
    visual_lines = []

    mode = None

    def save_current_item():
        """
        Save the current item only if it contains
        actual answer or visual content.
        """

        nonlocal answer_lines
        nonlocal visual_lines

        answer_text = "\n".join(
            answer_lines
        ).strip()

        visual_text = "\n".join(
            visual_lines
        ).strip()

        if not answer_text and not visual_text:
            answer_lines = []
            visual_lines = []
            return

        if current_question is None:
            answer_lines = []
            visual_lines = []
            return

        content_blocks = []

        if answer_text:
            content_blocks.append(
                {
                    "block_number": 1,
                    "type": "TEXT",
                    "content": answer_text,
                }
            )

        if (
            visual_text
            and visual_text.upper() != "NONE"
        ):
            content_blocks.append(
                {
                    "block_number":
                        len(content_blocks) + 1,
                    "type": "DIAGRAM",
                    "content": visual_text,
                }
            )

        if not content_blocks:
            answer_lines = []
            visual_lines = []
            return

        raw_items.append(
            {
                "section_label":
                    current_section,

                "question_number":
                    current_question,

                "subquestion_label":
                    current_subquestion,

                "subpoint_label":
                    current_subpoint,

                "content_blocks":
                    content_blocks,
            }
        )

        answer_lines = []
        visual_lines = []

    for raw_line in lines:

        line = raw_line.strip()

        if not line:
            continue

        upper_line = line.upper()

        if upper_line == "STUDENT:":
            mode = "student"
            continue

        if upper_line == "SECTION:":
            save_current_item()

            current_question = None
            current_subquestion = "NONE"
            current_subpoint = "NONE"

            mode = "section"
            continue

        if upper_line == "QUESTION:":
            save_current_item()

            current_subquestion = "NONE"
            current_subpoint = "NONE"

            mode = "question"
            continue

        if upper_line == "SUBQUESTION:":
            save_current_item()

            current_subpoint = "NONE"

            mode = "subquestion"
            continue

        if upper_line == "SUBPOINT:":
            save_current_item()

            mode = "subpoint"
            continue

        if upper_line == "ANSWER:":
            mode = "answer"
            continue

        if upper_line == "VISUAL:":
            mode = "visual"
            continue

        if mode == "student":

            student_lines.append(
                raw_line.strip()
            )

        elif mode == "section":

            current_section = line
            mode = None

        elif mode == "question":

            number_match = re.search(
                r"\b(\d+)\b",
                line,
            )

            if number_match:
                current_question = int(
                    number_match.group(1)
                )
            else:
                current_question = line

            mode = None

        elif mode == "subquestion":

            current_subquestion = line
            mode = None

        elif mode == "subpoint":

            current_subpoint = line
            mode = None

        elif mode == "answer":

            answer_lines.append(
                raw_line.strip()
            )

        elif mode == "visual":

            visual_lines.append(
                raw_line.strip()
            )

    save_current_item()

    student = "\n".join(
        student_lines
    ).strip()

    if not student:
        student = "UNKNOWN"

    normalized_items = normalize_structure(
        raw_items
    )

    sections = []

    for index, item in enumerate(
        normalized_items,
        start=1,
    ):

        sections.append(
            {
                "section_number": None,

                "section_label":
                    item[
                        "section_label"
                    ],

                "question_number":
                    item[
                        "question_number"
                    ],

                "subquestion_label":
                    item[
                        "subquestion_label"
                    ],

                "subpoint_label":
                    item[
                        "subpoint_label"
                    ],

                "content_blocks":
                    item[
                        "content_blocks"
                    ],
            }
        )

    return student, sections
def normalize_structure(
    items: list[dict],
) -> list[dict]:
    """
    Correct obvious structural inconsistencies
    in the model output.

    This does NOT hard-code section names or question
    numbering.

    It only handles a common OCR structure failure:

        QUESTION: 1
        SUBQUESTION: 1
        SUBQUESTION: 2
        SUBQUESTION: 3

    when the numeric labels clearly form a peer
    question sequence.

    Such items are promoted to:

        QUESTION: 1
        QUESTION: 2
        QUESTION: 3
    """

    if not items:
        return []

    normalized = []

    index = 0

    while index < len(items):

        item = items[index]

        question_number = item.get(
            "question_number"
        )

        subquestion_label = item.get(
            "subquestion_label",
            "NONE",
        )

        if (
            question_number is not None
            and subquestion_label == "NONE"
        ):
            normalized.append(item)
            index += 1
            continue

        if (
            question_number is not None
            and is_numeric_label(
                subquestion_label
            )
        ):

            group = [item]

            next_index = index + 1

            while (
                next_index < len(items)
                and items[next_index].get(
                    "question_number"
                ) == question_number
                and is_numeric_label(
                    items[next_index].get(
                        "subquestion_label",
                        "NONE",
                    )
                )
            ):

                group.append(
                    items[next_index]
                )

                next_index += 1

            if looks_like_peer_question_sequence(
                group
            ):

                promoted = promote_numeric_subquestions(
                    group
                )

                normalized.extend(
                    promoted
                )

                index = next_index
                continue

        normalized.append(item)

        index += 1

    return normalized


def is_numeric_label(
    label: str | None,
) -> bool:
    """
    Determine whether a label is purely numeric.
    """

    if label is None:
        return False

    label = str(label).strip()

    return bool(
        re.fullmatch(
            r"\d+",
            label,
        )
    )


def looks_like_peer_question_sequence(
    group: list[dict],
) -> bool:
    """
    Detect whether numeric subquestion labels are
    actually a peer question sequence.

    The strongest signal is:

        Question X
        subquestion 1
        subquestion 2
        subquestion 3

    where the labels are sequential and the first
    label starts at 1.
    """

    if len(group) < 2:
        return False

    labels = []

    for item in group:

        label = item.get(
            "subquestion_label",
            "NONE",
        )

        if not is_numeric_label(label):
            return False

        labels.append(
            int(label)
        )

    expected = list(
        range(
            1,
            len(labels) + 1,
        )
    )

    if labels != expected:
        return False

    return True


def promote_numeric_subquestions(
    group: list[dict],
) -> list[dict]:
    """
    Promote a numeric subquestion sequence into
    peer questions.

    Example:

        QUESTION 1
        SUBQUESTION 1
        SUBQUESTION 2
        SUBQUESTION 3

    becomes:

        QUESTION 1
        QUESTION 2
        QUESTION 3
    """

    promoted = []

    base_question = group[0].get(
        "question_number"
    )

    for index, item in enumerate(
        group
    ):

        if index == 0:
            question_number = base_question
        else:
            question_number = (
                base_question
                + index
            )

        promoted.append(
            {
                "section_label":
                    item.get(
                        "section_label",
                        "NONE",
                    ),

                "question_number":
                    question_number,

                "subquestion_label":
                    "NONE",

                "subpoint_label":
                    "NONE",

                "content_blocks":
                    item.get(
                        "content_blocks",
                        [],
                    ),
            }
        )

    return promoted


def extract_text_from_sections(
    sections: list[dict],
) -> str:
    """
    Convert structured sections into readable
    normalized OCR text.
    """

    if not sections:
        return ""

    output = []

    current_section = None
    current_question = None
    current_subquestion = None
    current_subpoint = None

    for section in sections:

        section_label = section.get(
            "section_label",
            "NONE",
        )

        question_number = section.get(
            "question_number"
        )

        subquestion_label = section.get(
            "subquestion_label",
            "NONE",
        )

        subpoint_label = section.get(
            "subpoint_label",
            "NONE",
        )

        if section_label != current_section:

            output.append(
                f"SECTION: {section_label}"
            )

            current_section = section_label

            current_question = None
            current_subquestion = None
            current_subpoint = None

        if question_number != current_question:

            output.append(
                f"QUESTION: {question_number}"
            )

            current_question = question_number

            current_subquestion = None
            current_subpoint = None

        if (
            subquestion_label != "NONE"
            and subquestion_label
            != current_subquestion
        ):

            output.append(
                f"SUBQUESTION: "
                f"{subquestion_label}"
            )

            current_subquestion = (
                subquestion_label
            )

            current_subpoint = None

        if (
            subpoint_label != "NONE"
            and subpoint_label
            != current_subpoint
        ):

            output.append(
                f"SUBPOINT: "
                f"{subpoint_label}"
            )

            current_subpoint = (
                subpoint_label
            )

        for block in section.get(
            "content_blocks",
            [],
        ):

            block_type = block.get(
                "type",
                "TEXT",
            )

            content = block.get(
                "content",
                "",
            ).strip()

            if not content:
                continue

            if block_type == "TEXT":
                output.append(content)

            elif block_type == "DIAGRAM":
                output.append(
                    f"[DIAGRAM]\n{content}"
                )

            elif block_type == "TABLE":
                output.append(
                    f"[TABLE]\n{content}"
                )

            elif block_type == "EQUATION":
                output.append(
                    f"[EQUATION]\n{content}"
                )

            else:
                output.append(content)

    return "\n\n".join(
        output
    ).strip()


def extract_visual_content(
    sections: list[dict],
) -> tuple[str, list[dict]]:
    """
    Extract visual content from structured sections.
    """

    visual_items = []

    for section in sections:

        question_number = section.get(
            "question_number"
        )

        subquestion_label = section.get(
            "subquestion_label",
            "NONE",
        )

        subpoint_label = section.get(
            "subpoint_label",
            "NONE",
        )

        for block in section.get(
            "content_blocks",
            [],
        ):

            block_type = block.get(
                "type",
                "",
            ).upper()

            if block_type not in {
                "DIAGRAM",
                "TABLE",
                "EQUATION",
            }:
                continue

            content = block.get(
                "content",
                "",
            ).strip()

            if not content:
                continue

            visual_items.append(
                {
                    "question_number":
                        question_number,

                    "subquestion_label":
                        subquestion_label,

                    "subpoint_label":
                        subpoint_label,

                    "type":
                        block_type,

                    "content":
                        content,
                }
            )

    if not visual_items:
        return "NONE", []

    visual_text_parts = []

    for item in visual_items:

        label = (
            f"Q{item['question_number']}"
        )

        if (
            item["subquestion_label"]
            != "NONE"
        ):
            label += (
                f"({item['subquestion_label']})"
            )

        if (
            item["subpoint_label"]
            != "NONE"
        ):
            label += (
                f"({item['subpoint_label']})"
            )

        visual_text_parts.append(
            f"{label} "
            f"{item['type']}: "
            f"{item['content']}"
        )

    return (
        "\n".join(
            visual_text_parts
        ),
        visual_items,
    )


def extract_text_from_image(
    image_path: str | Path,
) -> dict:
    """
    Complete OCR pipeline for one image.

    Pipeline:

    validation
        ↓
    preprocessing
        ↓
    Featherless vision OCR
        ↓
    hierarchy parsing
        ↓
    structural normalization
        ↓
    visual extraction
        ↓
    confidence
        ↓
    structured response
    """

    image_path = Path(image_path)

    # ------------------------------------------
    # 1. Validate
    # ------------------------------------------

    validation = validate_file(
        image_path
    )

    # ------------------------------------------
    # 2. Preprocess
    # ------------------------------------------

    processed_path = (
        Path("tmp")
        / f"{image_path.stem}_processed.png"
    )

    preprocessing_result = (
        preprocess_image(
            image_path,
            processed_path,
        )
    )

    # ------------------------------------------
    # 3. Encode
    # ------------------------------------------

    image_base64 = image_to_base64(
        processed_path
    )

    image_data_url = (
        "data:image/png;base64,"
        + image_base64
    )

    # ------------------------------------------
    # 4. Featherless OCR
    # ------------------------------------------

    response = client.chat.completions.create(
        model=FEATHERLESS_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": build_ocr_prompt(),
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_data_url,
                        },
                    },
                ],
            }
        ],
        temperature=0,
    )

    raw_result = (
        response.choices[0]
        .message
        .content
        or ""
    ).strip()

    if not raw_result:
        raise RuntimeError(
            "Featherless AI returned an empty OCR response."
        )

    # ------------------------------------------
    # 5. Parse + normalize
    # ------------------------------------------

    (
        student,
        question_sections,
    ) = parse_question_sections(
        raw_result
    )

    text = extract_text_from_sections(
        question_sections
    )

    # ------------------------------------------
    # 6. Visual content
    # ------------------------------------------

    (
        visual_content,
        visual_items,
    ) = extract_visual_content(
        question_sections
    )

    has_visual_content = bool(
        visual_items
    )

    # ------------------------------------------
    # 7. Question numbers
    # ------------------------------------------

    question_numbers = []

    for section in question_sections:

        question_number = section.get(
            "question_number"
        )

        if (
            isinstance(
                question_number,
                int,
            )
            and question_number
            not in question_numbers
        ):

            question_numbers.append(
                question_number
            )

    question_numbers.sort()

    primary_question_number = (
        question_numbers[0]
        if question_numbers
        else None
    )

    # ------------------------------------------
    # 8. Flatten content blocks
    # ------------------------------------------

    content_blocks = []

    for section in question_sections:

        for block in section.get(
            "content_blocks",
            [],
        ):

            content_blocks.append(
                {
                    "block_number":
                        len(content_blocks) + 1,

                    "type":
                        block.get(
                            "type",
                            "TEXT",
                        ),

                    "content":
                        block.get(
                            "content",
                            "",
                        ),
                }
            )

    # ------------------------------------------
    # 9. Confidence
    # ------------------------------------------

    confidence_result = (
    calculate_ocr_confidence(
        text=text,
        visual_content=visual_content,
        image_width=preprocessing_result["width"],
        image_height=preprocessing_result["height"],
        question_sections=question_sections,
        question_numbers=question_numbers,
    )
)

    # ------------------------------------------
    # 10. Return
    # ------------------------------------------

    return {
        "success": True,

        "source_file":
            image_path.name,

        "student":
            student,

        "validation":
            validation,

        "processed_file":
            str(processed_path),

        "image_width":
            preprocessing_result[
                "width"
            ],

        "image_height":
            preprocessing_result[
                "height"
            ],

        "text":
            text,

        "visual_content":
            visual_content,

        "visual_items":
            visual_items,

        "has_visual_content":
            has_visual_content,

        "question_number":
            primary_question_number,

        "question_numbers":
            question_numbers,

        "question_sections":
            question_sections,

        "content_blocks":
            content_blocks,

        "ocr_confidence":
            confidence_result[
                "confidence"
            ],

        "ocr_confidence_percent":
            confidence_result[
                "confidence_percent"
            ],

        "ocr_confidence_level":
            confidence_result[
                "level"
            ],

        "confidence_reasons":
            confidence_result[
                "reasons"
            ],

        "raw_result":
            raw_result,
    }