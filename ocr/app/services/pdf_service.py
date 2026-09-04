from pathlib import Path

import pymupdf


SUPPORTED_PDF_EXTENSIONS = {".pdf"}


def pdf_to_images(
    pdf_path: str | Path,
    output_dir: str | Path = "tmp/pdf_pages",
) -> list[dict]:
    """
    Convert every page of a PDF into a PNG image.

    Returns a list containing information about each page.
    """

    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {pdf_path}"
        )

    if pdf_path.suffix.lower() not in SUPPORTED_PDF_EXTENSIONS:
        raise ValueError(
            "Only PDF files are supported."
        )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    try:
        document = pymupdf.open(pdf_path)

        if document.page_count == 0:
            document.close()
            raise ValueError("The PDF contains no pages.")

        pages = []

        for page_number in range(document.page_count):
            page = document.load_page(page_number)

            # Render the PDF page at approximately 150 DPI.
            matrix = pymupdf.Matrix(2, 2)

            pixmap = page.get_pixmap(
                matrix=matrix,
                alpha=False,
            )

            output_path = (
                output_dir
                / f"{pdf_path.stem}_page_{page_number + 1}.png"
            )

            pixmap.save(output_path)

            pages.append(
                {
                    "page_number": page_number + 1,
                    "file": output_path.name,
                    "path": str(output_path),
                    "width": pixmap.width,
                    "height": pixmap.height,
                }
            )

        document.close()

        return pages

    except ValueError:
        raise

    except Exception as exc:
        raise RuntimeError(
            f"Failed to convert PDF to images: {exc}"
        ) from exc