"""Apple TV brand assets from assets/icon.png.

Home icon layers 400×240 and 800×480. App Store layers 1280×768.
Top Shelf 1920×720 and wide 2320×720, plus @2x.
Back layer: ArabGram emerald. Front layer: the cream letter and gold ring.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "icon.png"
OUT = ROOT / "assets" / "tv"
EMERALD = (14, 77, 69, 255)


def is_field(red: int, green: int, blue: int) -> bool:
    return abs(red - 14) < 36 and abs(green - 77) < 42 and abs(blue - 69) < 42


def front_from(mark: Image.Image) -> Image.Image:
    image = mark.convert("RGBA")
    pixels = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if is_field(red, green, blue):
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (red, green, blue, alpha)
    return image


def back_layer(width: int, height: int) -> Image.Image:
    canvas = Image.new("RGBA", (width, height), EMERALD)
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    cx, cy = width / 2, height / 2
    radius = int(min(width, height) * 0.62)
    for step in range(radius, 0, -3):
        fade = 1 - (step / radius)
        alpha = int(70 * (fade ** 1.5))
        draw.ellipse((cx - step, cy - step, cx + step, cy + step), fill=(153, 104, 28, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(8, min(width, height) // 40)))
    return Image.alpha_composite(canvas, glow).convert("RGB")


def fit(mark: Image.Image, width: int, height: int) -> Image.Image:
    scale = min((height * 0.78) / mark.height, (width * 0.62) / mark.width)
    resized = mark.resize((max(1, int(mark.width * scale)), max(1, int(mark.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.paste(resized, ((width - resized.width) // 2, (height - resized.height) // 2), resized)
    return canvas


def shelf(mark: Image.Image, width: int, height: int) -> Image.Image:
    base = back_layer(width, height).convert("RGBA")
    return Image.alpha_composite(base, fit(mark, width, height)).convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    mark = front_from(Image.open(SRC))
    jobs = {
        "icon-home-back.png": lambda: back_layer(400, 240),
        "icon-home-back@2x.png": lambda: back_layer(800, 480),
        "icon-home-front.png": lambda: fit(mark, 400, 240),
        "icon-home-front@2x.png": lambda: fit(mark, 800, 480),
        "icon-store-back.png": lambda: back_layer(1280, 768),
        "icon-store-front.png": lambda: fit(mark, 1280, 768),
        "top-shelf.png": lambda: shelf(mark, 1920, 720),
        "top-shelf@2x.png": lambda: shelf(mark, 3840, 1440),
        "top-shelf-wide.png": lambda: shelf(mark, 2320, 720),
        "top-shelf-wide@2x.png": lambda: shelf(mark, 4640, 1440),
    }
    for name, draw in jobs.items():
        image = draw()
        image.save(OUT / name, "PNG")
        print(name, image.size, image.mode)


if __name__ == "__main__":
    main()
