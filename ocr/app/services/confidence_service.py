def calculate_ocr_confidence(
    text: str,
    visual_content: str = "NONE",
    image_width: int | None = None,
    image_height: int | None = None,
    question_sections: list[dict] | None = None,
    question_numbers: list[int] | None = None,
) -> dict:
    """
    Estimate the reliability of the OCR pipeline.

    This is a heuristic reliability score.
    It is NOT a statistical probability that the OCR
    text is correct.

    Confidence considers:

    1. OCR/text quality
    2. Image/scanning quality
    3. Question/answer structure quality
    4. Unclear OCR regions
    """

    text = (text or "").strip()
    visual_content = (visual_content or "").strip()

    question_sections = question_sections or []
    question_numbers = question_numbers or []

    score = 1.0
    reasons = []

    # ---------------------------------------------------------
    # 1. OCR / TEXT QUALITY
    # ---------------------------------------------------------

    if not text:
        score -= 0.50

        reasons.append(
            "No text was extracted from the answer."
        )

    unclear_count = text.count("[UNCLEAR]")

    if unclear_count > 0:
        penalty = min(
            0.10 * unclear_count,
            0.40,
        )

        score -= penalty

        reasons.append(
            f"{unclear_count} unclear OCR region(s) detected."
        )

    if text and len(text) < 20:
        score -= 0.15

        reasons.append(
            "Very little text was extracted."
        )

    # Extremely short OCR output can indicate
    # a blank page, poor handwriting recognition,
    # or a scanning problem.
    if text and len(text) < 50:
        score -= 0.05

        reasons.append(
            "The extracted answer is unusually short."
        )

    # ---------------------------------------------------------
    # 2. IMAGE / SCANNING QUALITY
    # ---------------------------------------------------------

    if image_width is not None and image_height is not None:

        if image_width < 1000:
            score -= 0.15

            reasons.append(
                "Image width is low and may affect handwriting recognition."
            )

        elif image_width < 1400:
            score -= 0.07

            reasons.append(
                "Image resolution is moderate."
            )

        if image_height < 1000:
            score -= 0.10

            reasons.append(
                "Image height is low and may affect OCR."
            )

        # Very small total image area is suspicious.
        total_pixels = image_width * image_height

        if total_pixels < 1_500_000:
            score -= 0.05

            reasons.append(
                "The scanned image contains relatively few pixels."
            )

    elif image_width is None or image_height is None:

        reasons.append(
            "Image quality could not be fully evaluated."
        )

    # ---------------------------------------------------------
    # 3. STRUCTURE QUALITY
    # ---------------------------------------------------------

    if question_numbers:

        # Remove duplicates while preserving order.
        unique_questions = list(
            dict.fromkeys(question_numbers)
        )

        if len(unique_questions) < len(question_numbers):

            score -= 0.05

            reasons.append(
                "Duplicate question numbers were detected."
            )

        # Check for unusually large gaps.
        sorted_questions = sorted(
            set(question_numbers)
        )

        if len(sorted_questions) >= 2:

            gaps = []

            for index in range(
                len(sorted_questions) - 1
            ):
                gap = (
                    sorted_questions[index + 1]
                    - sorted_questions[index]
                )

                if gap > 1:
                    gaps.append(gap)

            if gaps:

                score -= min(
                    0.05 * len(gaps),
                    0.15,
                )

                reasons.append(
                    "Some question numbers are missing or skipped."
                )

    # ---------------------------------------------------------
    # 4. EMPTY STRUCTURE CHECK
    # ---------------------------------------------------------

    if question_sections:

        empty_sections = 0

        total_sections = len(
            question_sections
        )

        for section in question_sections:

            content_blocks = section.get(
                "content_blocks",
                [],
            )

            section_text = str(
                section.get(
                    "text",
                    "",
                )
            ).strip()

            has_content = bool(
                content_blocks
                or section_text
            )

            if not has_content:
                empty_sections += 1

        if empty_sections > 0:

            empty_ratio = (
                empty_sections
                / total_sections
            )

            # Small number of empty sections:
            # minor structural uncertainty.
            if empty_ratio <= 0.20:

                score -= 0.05

                reasons.append(
                    f"{empty_sections} empty structure section(s) detected."
                )

            # More empty sections:
            # stronger structural uncertainty.
            elif empty_ratio <= 0.50:

                score -= 0.15

                reasons.append(
                    f"{empty_sections} of {total_sections} "
                    "structure sections are empty."
                )

            else:

                score -= 0.25

                reasons.append(
                    "A large portion of the detected "
                    "answer structure is empty."
                )

    # ---------------------------------------------------------
    # 5. VISUAL CONTENT
    # ---------------------------------------------------------

    if (
        visual_content
        and visual_content.upper() != "NONE"
    ):

        reasons.append(
            "Visual content was detected and preserved."
        )

    # ---------------------------------------------------------
    # 6. FINAL SCORE
    # ---------------------------------------------------------

    score = max(
        0.0,
        min(
            1.0,
            score,
        ),
    )

    if score >= 0.85:
        level = "HIGH"

    elif score >= 0.60:
        level = "MEDIUM"

    else:
        level = "LOW"

    # If no problems were found, give an explicit
    # positive reason rather than returning an empty list.
    if not reasons:

        reasons.append(
            "No significant OCR, image, or structure issues detected."
        )

    return {
        "confidence": round(
            score,
            2,
        ),
        "confidence_percent": round(
            score * 100,
        ),
        "level": level,
        "reasons": reasons,
    }