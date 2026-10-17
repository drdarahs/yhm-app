"""Face It backgrounds: photos runners load in the Garmin Connect IQ app (Face It) to get
an instant YHM watch face. The middle is left clear for the time Face It draws."""
import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
T = pathlib.Path(__file__).resolve().parent
ROOT = T.parent.parent
OUT = T.parent / "faceit"; OUT.mkdir(exist_ok=True)
logo = Image.open(ROOT / "brand/source/yhm-logo.png").convert("RGBA")
stadium = Image.open(ROOT / "brand/source/nehru-stadium.jpg").convert("RGB")
BOLD = str(T / "BarlowCondensed-Bold.ttf")
NAVY, ORANGE, SKY = (27, 64, 116), (239, 126, 20), (1, 160, 226)
S = 454 * 2

def chip(w):
    pad = round(w * 0.06); lw = w - 2 * pad
    lh = round(lw * logo.height / logo.width)
    c = Image.new("RGBA", (w, lh + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle([0, 0, w - 1, lh + 2 * pad - 1], radius=round(w * 0.08), fill="white")
    c.alpha_composite(logo.resize((lw, lh), Image.LANCZOS), (pad, pad)); return c

def stripe(d, y, w, h, first=NAVY):
    x0 = (S - w) / 2
    for i, c in enumerate((first, ORANGE, SKY)):
        d.rectangle([x0 + i * w / 3, y, x0 + (i + 1) * w / 3 - 3, y + h], fill=c)

def text(d, y, s, size, col):
    d.text((S / 2, y), s, font=ImageFont.truetype(BOLD, size), fill=col, anchor="mm")

# 1. Navy face: logo at top, race date at the bottom
im = Image.new("RGB", (S, S), NAVY)
d = ImageDraw.Draw(im)
for r, a in ((S * 0.62, 18), (S * 0.5, 24)):
    d.ellipse([S / 2 - r, S / 2 - r, S / 2 + r, S / 2 + r], outline=(255, 255, 255, a), width=3)
c = chip(round(S * 0.42)); im.paste(c, (round((S - c.width) / 2), round(S * 0.10)), c)
stripe(d, S * 0.78, S * 0.30, S * 0.012, first=(255, 255, 255))
text(d, S * 0.845, "SUN 3 JAN 2027", round(S * 0.058), (255, 255, 255))
text(d, S * 0.90, "NEHRU STADIUM · YAVATMAL", round(S * 0.034), (180, 200, 230))
im.resize((454, 454), Image.LANCZOS).save(OUT / "yhm-faceit-navy.png")

# 2. Stadium photo face
h = S; w = round(stadium.width * h / stadium.height)
ph = stadium.resize((w, h), Image.LANCZOS).crop(((w - S) // 2, 0, (w - S) // 2 + S, S))
ph = ImageEnhance.Brightness(ph).enhance(0.55)
ov = Image.new("RGBA", (S, S), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
for y in range(S):
    a = int(110 + 120 * abs(y / S - 0.5) * 2)
    od.line([(0, y), (S, y)], fill=(10, 30, 62, min(230, a)))
im = ph.convert("RGBA"); im.alpha_composite(ov); im = im.convert("RGB")
d = ImageDraw.Draw(im)
c = chip(round(S * 0.40)); im.paste(c, (round((S - c.width) / 2), round(S * 0.10)), c)
stripe(d, S * 0.79, S * 0.30, S * 0.012)
text(d, S * 0.855, "3 · 1 · 2027", round(S * 0.062), (255, 255, 255))
im.resize((454, 454), Image.LANCZOS).save(OUT / "yhm-faceit-stadium.png")
print("face it backgrounds written")
