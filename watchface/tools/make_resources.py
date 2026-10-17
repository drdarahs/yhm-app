"""Builds the YHM 2027 watch face resources and preview images.

For each round screen size it writes:
  resources-round-WxW/drawables/logo.png   logo chip (official YHM mark on a white rounded badge)
  resources-round-WxW/fonts/time.fnt+png   big time digits in Barlow Condensed Bold (BMFont text format)
and a base set in resources/ (used by any other screen size).

It also renders preview images of the face (preview-*.png) that follow the same layout
fractions as source/YHMView.mc, so the design can be checked without a watch.

Run from anywhere:  python3 watchface/tools/make_resources.py
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

T = pathlib.Path(__file__).resolve().parent
WF = T.parent
ROOT = WF.parent
MARK = Image.open(ROOT / "brand/source/yhm-mark.png").convert("RGBA")
BOLD = str(T / "BarlowCondensed-Bold.ttf")
SEMI = str(T / "BarlowCondensed-SemiBold.ttf")

SIZES = [454, 416, 390, 360, 280, 260, 240, 218]
BASE = 240

# Layout fractions of screen width (kept in sync with YHMView.mc)
CHIP_W = 0.36      # logo chip width
CHIP_TOP = 0.095   # logo chip top
TIME_CAP = 0.25    # height of the time digits
TIME_Y = 0.465     # vertical centre of the time

NAVY, ORANGE, SKY = (27, 64, 116), (239, 126, 20), (1, 160, 226)


def chip(w):
    """White rounded badge with the official YHM mark, transparent corners."""
    w = max(40, round(w))
    pad = max(3, round(w * 0.07))
    lw = w - 2 * pad
    lh = round(lw * MARK.height / MARK.width)
    h = lh + 2 * pad
    k = 4  # supersample for smooth corners
    big = Image.new("RGBA", (w * k, h * k), (0, 0, 0, 0))
    ImageDraw.Draw(big).rounded_rectangle([0, 0, w * k - 1, h * k - 1], radius=round(h * k * 0.28), fill=(255, 255, 255, 255))
    c = big.resize((w, h), Image.LANCZOS)
    c.alpha_composite(MARK.resize((lw, lh), Image.LANCZOS), (pad, pad))
    return c


def bmfont(px_cap, out_dir, name="time"):
    """Digits and colon as a BMFont text-format font, white glyphs on transparent."""
    probe = ImageFont.truetype(BOLD, 100)
    cap = -probe.getbbox("0", anchor="ls")[1]          # digit height at size 100
    size = max(10, round(100 * px_cap / cap))
    f = ImageFont.truetype(BOLD, size)
    asc, desc = f.getmetrics()
    chars = "0123456789:"
    glyphs = []
    for ch in chars:
        x0, y0, x1, y1 = f.getbbox(ch, anchor="ls")
        gw, gh = x1 - x0 + 2, y1 - y0 + 2
        g = Image.new("RGBA", (gw, gh), (255, 255, 255, 0))
        ImageDraw.Draw(g).text((1 - x0, 1 - y0), ch, font=f, fill=(255, 255, 255, 255), anchor="ls")
        glyphs.append((ch, g, x0 - 1, asc + y0 - 1, round(f.getlength(ch))))
    # pack in one row-wrapped atlas
    maxw = 1024
    x = y = rowh = 0
    pos = []
    for ch, g, *_ in glyphs:
        if x + g.width > maxw:
            x, y, rowh = 0, y + rowh + 2, 0
        pos.append((x, y))
        x += g.width + 2
        rowh = max(rowh, g.height)
    W, H = maxw if y else x, y + rowh
    atlas = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    for (ch, g, *_), (px, py) in zip(glyphs, pos):
        atlas.paste(g, (px, py))
    out_dir.mkdir(parents=True, exist_ok=True)
    atlas.save(out_dir / f"{name}_0.png")
    lines = [
        f'info face="Barlow Condensed" size={size} bold=1 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2',
        f"common lineHeight={asc + desc} base={asc} scaleW={W} scaleH={H} pages=1 packed=0",
        f'page id=0 file="{name}_0.png"',
        f"chars count={len(chars)}",
    ]
    for (ch, g, xo, yo, adv), (px, py) in zip(glyphs, pos):
        lines.append(f"char id={ord(ch)} x={px} y={py} width={g.width} height={g.height} xoffset={xo} yoffset={yo} xadvance={adv} page=0 chnl=15")
    (out_dir / f"{name}.fnt").write_text("\n".join(lines) + "\n")
    (out_dir / "fonts.xml").write_text(f'<fonts>\n    <font id="TimeFont" filename="{name}.fnt" antialias="true" filter="0123456789:"/>\n</fonts>\n')


def write_set(folder, w):
    d = folder / "drawables"
    d.mkdir(parents=True, exist_ok=True)
    chip(w * CHIP_W).save(d / "logo.png")
    bmfont(w * TIME_CAP, folder / "fonts")


def drawables_xml(folder, with_icon):
    lines = ["<drawables>"]
    if with_icon:
        lines.append('    <bitmap id="LauncherIcon" filename="launcher_icon.png"/>')
    lines.append('    <bitmap id="Logo" filename="logo.png"/>')
    lines.append("</drawables>")
    (folder / "drawables" / "drawables.xml").write_text("\n".join(lines) + "\n")


def build_resources():
    base = WF / "resources"
    write_set(base, BASE)
    # launcher icon: official mark on a white circle
    k = 280
    ic = Image.new("RGBA", (k, k), (0, 0, 0, 0))
    ImageDraw.Draw(ic).ellipse([0, 0, k - 1, k - 1], fill=(255, 255, 255, 255))
    m = MARK.resize((round(k * 0.80), round(k * 0.80 * MARK.height / MARK.width)), Image.LANCZOS)
    ic.alpha_composite(m, ((k - m.width) // 2, (k - m.height) // 2))
    ic.resize((70, 70), Image.LANCZOS).save(base / "drawables/launcher_icon.png")
    drawables_xml(base, True)
    for s in SIZES:
        f = WF / f"resources-round-{s}x{s}"
        write_set(f, s)
        drawables_xml(f, False)


# ---------- preview renderer (mirrors YHMView.mc) ----------
def preview(w, days, mip=False, low=False, hr=72, steps=6240, goal=8000, batt=82, label=None):
    k = 3
    W = w * k
    im = Image.new("RGB", (W, W), (0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = W / 2
    f = lambda frac: frac * W
    def text(x, y, s, size, col, font=SEMI, anchor="mm"):
        d.text((x, y), s, font=ImageFont.truetype(font, max(8, round(size))), fill=col, anchor=anchor)
    if not low:
        pen = max(4, round(w * 0.022)) * k
        r = W / 2 - pen / 2 - k
        bb = [cx - r, cy - r, cx + r, cy + r]
        d.arc(bb, 0, 360, fill=(64, 64, 64), width=pen)
        p = min(1, steps / goal)
        if p > 0:
            d.arc(bb, -90, -90 + 360 * p, fill=SKY, width=pen)
        c = chip(w * CHIP_W).resize((round(w * CHIP_W) * k, round(chip(w * CHIP_W).height * k)), Image.LANCZOS)
        im.paste(c, (round(cx - c.width / 2), round(f(CHIP_TOP))), c)
        sy = f(CHIP_TOP) + c.height + f(0.022)
        sw, sh = f(0.21), max(2 * k, f(0.012))
        for i, col in enumerate((NAVY if not mip else (0, 85, 170), ORANGE, SKY)):
            d.rectangle([cx - sw / 2 + i * sw / 3, sy, cx - sw / 2 + (i + 1) * sw / 3 - k, sy + sh], fill=col)
    # time
    tf = ImageFont.truetype(BOLD, 10)
    cap = -ImageFont.truetype(BOLD, 100).getbbox("0", anchor="ls")[1]
    size = round(100 * (f(TIME_CAP if not low else 0.20)) / cap)
    tf = ImageFont.truetype(BOLD, size)
    hh, mm = "06", "42"
    parts = [(hh, (255, 255, 255) if not low else (170, 170, 170)), (":", ORANGE if not low else (120, 120, 120)), (mm, (255, 255, 255) if not low else (170, 170, 170))]
    total = sum(tf.getlength(s) for s, _ in parts)
    x = cx - total / 2
    base = f(TIME_Y) + f(TIME_CAP if not low else 0.20) / 2
    for s, col in parts:
        d.text((x, base), s, font=tf, fill=col, anchor="ls")
        x += tf.getlength(s)
    if low:
        text(cx, f(0.70), f"{days} DAYS TO YHM", f(0.06), (150, 90, 30))
    else:
        text(cx, f(0.645), "SAT 17 OCT", f(0.068), (180, 180, 180))
        msg = label or (f"{days} DAYS TO YHM 2027" if days > 1 else ("1 DAY TO YHM 2027" if days == 1 else "RACE DAY!"))
        text(cx, f(0.725), msg, f(0.075), ORANGE, BOLD)
        y = f(0.815)
        # heart
        hx = f(0.33)
        hs = f(0.019)
        d.ellipse([hx - hs * 2.2, y - hs * 1.1, hx - hs * 0.2, y + hs * 0.6], fill=(230, 40, 60))
        d.ellipse([hx - hs * 1.2, y - hs * 1.1, hx + hs * 0.8, y + hs * 0.6], fill=(230, 40, 60))
        d.polygon([(hx - hs * 2.1, y), (hx + hs * 0.7, y), (hx - hs * 0.7, y + hs * 1.6)], fill=(230, 40, 60))
        text(hx + hs * 1.4, y + hs * 0.2, str(hr), f(0.06), (255, 255, 255), SEMI, "lm")
        text(cx, y + hs * 0.2, f"{steps:,}", f(0.06), SKY if not mip else (0, 170, 255), SEMI)
        # battery
        bx, bw, bh = f(0.605), f(0.05), f(0.028)
        d.rectangle([bx, y - bh / 2, bx + bw, y + bh / 2], outline=(200, 200, 200), width=max(k, round(f(0.005))))
        d.rectangle([bx + bw, y - bh / 4, bx + bw + f(0.008), y + bh / 4], fill=(200, 200, 200))
        d.rectangle([bx + f(0.009), y - bh / 2 + f(0.009), bx + f(0.009) + (bw - f(0.018)) * batt / 100, y + bh / 2 - f(0.009)], fill=(60, 200, 120))
        text(bx + bw + f(0.018), y + hs * 0.2, f"{batt}%", f(0.06), (255, 255, 255), SEMI, "lm")
    im = im.resize((w, w), Image.LANCZOS)
    if mip:  # 64-colour memory-in-pixel screens
        pal = [v for r in (0, 85, 170, 255) for g in (0, 85, 170, 255) for b in (0, 85, 170, 255) for v in (r, g, b)]
        p = Image.new("P", (1, 1)); p.putpalette(pal + [0] * (768 - len(pal)))
        im = im.quantize(palette=p, dither=Image.Dither.NONE).convert("RGB")
    mask = Image.new("L", (w, w), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, w - 1, w - 1], fill=255)
    out = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


if __name__ == "__main__":
    build_resources()
    prev = WF / "preview"
    prev.mkdir(exist_ok=True)
    preview(454, 78).save(prev / "amoled-454.png")
    preview(454, 78, low=True).save(prev / "amoled-454-always-on.png")
    preview(260, 78, mip=True).save(prev / "mip-260.png")
    preview(454, 0).save(prev / "race-day-454.png")
    print("resources and previews written")
