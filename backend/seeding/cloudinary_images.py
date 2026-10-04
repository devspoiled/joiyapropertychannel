"""Seed-time image hosting: every demo photo (whether fetched from Unsplash
or composited locally) is uploaded to Cloudinary under a stable public_id
and only its secure_url is ever stored in the database — no image files are
committed to the repo or served by this project directly.

Uploads use overwrite=False, so re-running the seed command (it runs on
every container start) doesn't re-upload existing assets: Cloudinary just
returns the already-uploaded asset's info for a public_id it already has.
"""

import io
import urllib.request

import cloudinary.uploader
from django.conf import settings
from PIL import Image, ImageDraw


def is_configured() -> bool:
    return bool(settings.CLOUDINARY_CLOUD_NAME)


def upload_remote(url: str, public_id: str) -> str:
    """Have Cloudinary fetch and re-host an externally hosted image (e.g. an
    Unsplash photo), returning our own secure_url for it."""
    result = cloudinary.uploader.upload(
        url, public_id=public_id, overwrite=False, unique_filename=False, folder="joiya/seed"
    )
    return result["secure_url"]


def upload_local(file_path: str, public_id: str, *, overwrite: bool = False) -> str:
    """Upload a real local file (e.g. a provided headshot, not a stock photo)
    and return its Cloudinary secure_url."""
    result = cloudinary.uploader.upload(
        file_path, public_id=public_id, overwrite=overwrite, unique_filename=False, folder="joiya/seed"
    )
    return result["secure_url"]


def upload_marked_plot(base_url: str, box: tuple[float, float, float, float], public_id: str) -> str:
    """Composite a red plot-boundary marking (the look used by Pakistani real
    estate marketing sites) onto an aerial land photo, entirely in memory,
    and upload the result — box is (x0, y0, x1, y1) as fractions of the
    image's width/height."""
    with urllib.request.urlopen(base_url, timeout=15) as response:  # noqa: S310
        base = Image.open(io.BytesIO(response.read())).convert("RGB")
    w, h = base.size

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x0, y0, x1, y1 = (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))
    draw.rectangle([x0, y0, x1, y1], fill=(220, 30, 30, 55), outline=(230, 20, 20, 255), width=max(4, w // 90))
    r = max(5, w // 110)
    for cx, cy in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(230, 20, 20, 255), outline=(255, 255, 255, 230), width=2)

    composited = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
    buffer = io.BytesIO()
    composited.save(buffer, "JPEG", quality=88)
    buffer.seek(0)

    result = cloudinary.uploader.upload(
        buffer, public_id=public_id, overwrite=False, unique_filename=False, folder="joiya/seed"
    )
    return result["secure_url"]
