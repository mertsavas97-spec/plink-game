#!/usr/bin/env python3
"""Generate branded PLINK splash / icon assets matching the moodboard."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

BG = (10, 14, 23, 255)
TILES = [
    ((45, 124, 243), "P"),
    ((243, 45, 94), "L"),
    ((243, 45, 199), "I"),
    ((243, 199, 45), "N"),
    ((45, 243, 229), "K"),
]
FALLING = [
    ((45, 124, 243), "A"),
    ((243, 45, 94), "B"),
    ((243, 45, 199), "C"),
    ((243, 199, 45), "D"),
    ((45, 243, 229), "E"),
]


def font(size: int) -> ImageFont.ImageFont:
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_tile(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    size: int,
    color: tuple[int, int, int],
    letter: str,
    fnt: ImageFont.ImageFont,
) -> None:
    r = max(6, int(size * 0.22))
    draw.rounded_rectangle((x, y, x + size, y + size), radius=r, fill=color + (255,))
    # gloss
    draw.rounded_rectangle(
        (x + 2, y + 2, x + size - 2, y + int(size * 0.38)),
        radius=r,
        fill=(255, 255, 255, 45),
    )
    bbox = draw.textbbox((0, 0), letter, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        (x + (size - tw) / 2, y + (size - th) / 2 - 2),
        letter,
        fill=(255, 255, 255, 235),
        font=fnt,
    )


def make_splash(path: Path, w: int = 1284, h: int = 2778) -> None:
    img = Image.new("RGBA", (w, h), BG)
    draw = ImageDraw.Draw(img, "RGBA")

    tile = 148
    gap = 14
    total = 5 * tile + 4 * gap
    start_x = (w - total) // 2
    cy = int(h * 0.38)
    logo_font = font(78)
    for i, (color, letter) in enumerate(TILES):
        draw_tile(draw, start_x + i * (tile + gap), cy, tile, color, letter, logo_font)

    tag = "SAME COLORS. BIGGER MOMENTS."
    tag_font = font(36)
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) / 2, cy + tile + 48), tag, fill=(154, 163, 178, 255), font=tag_font)

    # Falling decorative tiles
    fall_font = font(42)
    placements = [
        (120, 180, 72, 0),
        (980, 260, 64, 1),
        (180, 720, 56, 2),
        (1050, 900, 70, 3),
        (80, 1400, 60, 4),
        (1100, 1600, 54, 0),
        (220, 2100, 68, 1),
        (980, 2200, 58, 2),
        (140, 2450, 50, 3),
        (1080, 2500, 62, 4),
    ]
    for x, y, size, idx in placements:
        color, letter = FALLING[idx % len(FALLING)]
        draw_tile(draw, x, y, size, color, letter, fall_font)

    img.save(path, "PNG")


def make_icon(path: Path, size: int = 1024) -> None:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img, "RGBA")
    tile = int(size * 0.16)
    gap = int(size * 0.02)
    total = 5 * tile + 4 * gap
    start_x = (size - total) // 2
    cy = (size - tile) // 2
    fnt = font(int(tile * 0.55))
    for i, (color, letter) in enumerate(TILES):
        draw_tile(draw, start_x + i * (tile + gap), cy, tile, color, letter, fnt)
    img.save(path, "PNG")


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    make_splash(ASSETS / "splash.png")
    make_splash(ASSETS / "splash-icon.png", w=1024, h=1024)
    # Smaller centered logo mark for adaptive / splash icon crop
    make_icon(ASSETS / "icon.png")
    make_icon(ASSETS / "adaptive-icon.png")
    print("Wrote splash/icon assets to", ASSETS)


if __name__ == "__main__":
    main()
