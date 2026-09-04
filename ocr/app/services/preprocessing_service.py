from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


SUPPORTED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


def preprocess_image(
    input_path: str | Path,
    output_path: str | Path,
) -> dict:
    """
    Prepare a student answer image for OCR.

    Processing:
    1. Correct image orientation using EXIF data.
    2. Convert to RGB.
    3. Convert to grayscale.
    4. Improve contrast.
    5. Slightly improve brightness.
    6. Reduce small image noise.
    7. Sharpen handwriting.
    8. Save the processed image.

    Returns information about the processed image.
    """

    input_path = Path(input_path)
    output_path = Path(output_path)

    if not input_path.exists():
        raise FileNotFoundError(
            f"Input image not found: {input_path}"
        )

    if input_path.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
        raise ValueError(
            f"Unsupported image format: {input_path.suffix}"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        image = Image.open(input_path)

        # Correct orientation based on the camera's EXIF metadata.
        image = ImageOps.exif_transpose(image)

        # Convert to grayscale.
        image = image.convert("L")

        # Improve contrast while keeping faint handwriting.
        image = ImageOps.autocontrast(
            image,
            cutoff=1,
        )

        # Slight brightness improvement.
        image = ImageEnhance.Brightness(image).enhance(1.05)

        # Reduce small camera/compression noise.
        image = image.filter(
            ImageFilter.MedianFilter(size=3)
        )

        # Sharpen handwriting.
        image = image.filter(
            ImageFilter.UnsharpMask(
                radius=1,
                percent=120,
                threshold=3,
            )
        )

        # Make sure the image is large enough for OCR.
        width, height = image.size

        minimum_width = 1600

        if width < minimum_width:
            scale = minimum_width / width
            new_width = int(width * scale)
            new_height = int(height * scale)

            image = image.resize(
                (new_width, new_height),
                Image.Resampling.LANCZOS,
            )

        # Save as PNG so we don't introduce JPEG compression artifacts.
        image.save(
            output_path,
            format="PNG",
        )

        return {
            "input_file": input_path.name,
            "output_file": output_path.name,
            "width": image.width,
            "height": image.height,
            "format": "PNG",
            "grayscale": True,
        }

    except Exception as exc:
        raise RuntimeError(
            f"Failed to preprocess image: {exc}"
        ) from exc