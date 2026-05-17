#!/usr/bin/env python3
"""
Favicon generator for simonweigold.github.io

Design: Bauhaus-style monogram matching the portfolio grid aesthetic.
  - Large sizes (≥96 px): dark #111 background, red #E63946 square offset
    left-centre, yellow #F4D35E accent square top-right, cream #FDFBF7 "S"
    in Inter ExtraBold centred on the red square.
  - Small sizes (≤48 px): red background fills the whole icon, same "S",
    yellow accent dot in the top-right corner (omitted at 16 px).

Outputs written to ../public/:
  favicon.svg               — vector source, used by modern browsers
  favicon.ico               — 16 + 32 px embedded, for legacy browsers
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png      — 180 × 180, iOS home screen
  android-chrome-192x192.png
  android-chrome-512x512.png

Requirements:
  pip install Pillow

The font used is Inter ExtraBold, expected at:
  /usr/share/fonts/opentype/inter/Inter-ExtraBold.otf
Adjust FONT below if it lives somewhere else on your system.

Run from the repo root or from portfolio/:
  python3 portfolio/scripts/generate-favicon.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Colours (match DESIGN.md tokens) ──────────────────────────────────────────
BG      = (17,  17,  17,  255)   # #111111
SURFACE = (253, 251, 247, 255)   # #FDFBF7
RED     = (230, 57,  70,  255)   # #E63946
YELLOW  = (244, 211, 94,  255)   # #F4D35E

# ── Paths ──────────────────────────────────────────────────────────────────────
FONT = Path("/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf")
OUT  = Path(__file__).parent.parent / "public"


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_font(size: int) -> ImageFont.FreeTypeFont:
    if FONT.exists():
        return ImageFont.truetype(str(FONT), size)
    return ImageFont.load_default()


def draw_centered(draw: ImageDraw.ImageDraw, text: str, font, cx: int, cy: int, fill):
    """Draw `text` centred at pixel (cx, cy)."""
    bb = draw.textbbox((0, 0), text, font=font)
    tx = cx - (bb[2] - bb[0]) // 2 - bb[0]
    ty = cy - (bb[3] - bb[1]) // 2 - bb[1]
    draw.text((tx, ty), text, font=font, fill=fill)


# ── Composition ───────────────────────────────────────────────────────────────

def make_large(size: int) -> Image.Image:
    """Full Bauhaus composition for icons ≥ 96 px."""
    img = Image.new("RGBA", (size, size), BG)
    d   = ImageDraw.Draw(img)

    # Red primary square — ~66 % of canvas, offset left and down
    rs      = int(size * 0.656)
    rx, ry  = int(size * 0.063), int(size * 0.172)
    d.rectangle([rx, ry, rx + rs - 1, ry + rs - 1], fill=RED)

    # Yellow accent square — top-right corner, ~19 %
    ys      = int(size * 0.188)
    yx      = size - ys - int(size * 0.063)
    yy      = int(size * 0.063)
    d.rectangle([yx, yy, yx + ys - 1, yy + ys - 1], fill=YELLOW)

    # "S" centred on the red square
    font = load_font(int(rs * 0.78))
    draw_centered(d, "S", font, rx + rs // 2, ry + rs // 2, SURFACE)

    return img


def make_small(size: int) -> Image.Image:
    """Simplified composition for icons ≤ 48 px."""
    img = Image.new("RGBA", (size, size), RED)
    d   = ImageDraw.Draw(img)

    # Yellow corner dot (skip at 16 px — too noisy)
    if size >= 24:
        ys = max(3, size // 5)
        d.rectangle([size - ys - 1, 1, size - 2, ys], fill=YELLOW)

    font = load_font(int(size * 0.70))
    draw_centered(d, "S", font, size // 2, size // 2, SURFACE)

    return img


# ── SVG source ────────────────────────────────────────────────────────────────

SVG = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#111111"/>
  <rect x="32" y="88" width="336" height="336" fill="#E63946"/>
  <rect x="384" y="32" width="96" height="96" fill="#F4D35E"/>
  <text
    x="200" y="256"
    font-family="Inter, Arial Black, sans-serif"
    font-weight="800"
    font-size="262"
    fill="#FDFBF7"
    text-anchor="middle"
    dominant-baseline="central"
  >S</text>
</svg>
"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    OUT.mkdir(parents=True, exist_ok=True)

    # Vector (modern browsers use this first)
    (OUT / "favicon.svg").write_text(SVG)
    print("  favicon.svg")

    # Large PNG icons
    for size, name in [
        (512, "android-chrome-512x512.png"),
        (192, "android-chrome-192x192.png"),
        (180, "apple-touch-icon.png"),
    ]:
        make_large(size).save(OUT / name)
        print(f"  {name}")

    # Small PNG icons
    for size in (32, 16):
        make_small(size).save(OUT / f"favicon-{size}x{size}.png")
        print(f"  favicon-{size}x{size}.png")

    # ICO with 16 + 32 px embedded
    ico16 = make_small(16)
    ico32 = make_small(32)
    ico16.save(
        OUT / "favicon.ico",
        format="ICO",
        append_images=[ico32],
        sizes=[(16, 16), (32, 32)],
    )
    print("  favicon.ico")

    print(f"\nDone — files written to {OUT.resolve()}")


if __name__ == "__main__":
    main()
