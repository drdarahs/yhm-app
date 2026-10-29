# Builds every app image from the YHM 2027 brand files in brand/source/yhm2027:
# Android launcher icons, splash and notification icon; iPhone icon and launch image;
# Play Store icon and feature graphic; the logos used inside the app (www/img).
#   python3 brand/make_assets.py
# The first run cuts logo-light/logo-dark/mark from primary-logo.png (official YHM 2027 logo, transparent).
import pathlib, glob, asyncio
import numpy as np
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
B = ROOT/'brand'; SRC = B/'source'/'yhm2027'; RES = ROOT/'android/app/src/main/res'; XC = ROOT/'ios/App/App/Assets.xcassets'
INK = (18,21,18); LIME_Y = (215,226,31); LIME = (174,212,50); GREEN = (125,194,67)

def cut_logos():
    im = Image.open(SRC/'primary-logo.png').convert('RGBA'); a = np.array(im)
    op = a[...,3] > 10; cols = np.where(op.any(0))[0]; rows = np.where(op.any(1))[0]
    box = (cols.min()-10, rows.min()-10, cols.max()+11, rows.max()+11)
    im.crop(box).save(SRC/'logo-light.png')
    rgb = a[...,:3].astype(int); mx = rgb.max(-1); mn = rgb.min(-1)
    d = a.copy(); d[(mx < 140) & ((mx-mn) < 40), :3] = 255          # black text and divider -> white
    Image.fromarray(d).crop(box).save(SRC/'logo-dark.png')
    colsum = op.sum(0); x = cols.min()
    while colsum[x] > 0: x += 1                                        # the runner ends at the first empty column
    m = im.crop((cols.min(), 0, x, im.height)); mo = np.array(m)[...,3] > 10; r = np.where(mo.any(1))[0]
    m.crop((0, r.min(), m.width, r.max()+1)).save(SRC/'mark.png')
if not (SRC/'mark.png').exists(): cut_logos()

mark = Image.open(SRC/'mark.png').convert('RGBA')
logo_l = Image.open(SRC/'logo-light.png').convert('RGBA'); logo_d = Image.open(SRC/'logo-dark.png').convert('RGBA')
def fit(img, w): return img.resize((w, round(w*img.height/img.width)), Image.LANCZOS)
def centered(c, img, dy=0): c.alpha_composite(img, ((c.width-img.width)//2, (c.height-img.height)//2+dy))
def solid(img, rgb):
    a = np.array(img).copy(); a[...,:3] = rgb; return Image.fromarray(a)
def ink_bg(w, h):
    """Ink black with a faint lime glow at the top right, like the kit's dark app icon."""
    y, x = np.mgrid[0:h, 0:w]; d = np.sqrt((x-w*0.85)**2 + (y-h*0.1)**2) / max(w, h)
    t = np.clip(1-d*1.6, 0, 1)[..., None]*0.16
    base = np.array(INK, float); glow = np.array(GREEN, float)
    rgb = (base*(1-t) + glow*t).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, np.full((h, w), 255, np.uint8)]))
def bar(c, x0, w, y, h):
    """Lime-to-green brand bar."""
    g = np.linspace(0, 1, max(1, int(w)))[None, :, None]
    rgb = (np.array(LIME_Y)*(1-g) + np.array(GREEN)*g).astype(np.uint8)
    c.alpha_composite(Image.fromarray(np.dstack([np.repeat(rgb, h, 0), np.full((h, int(w)), 255, np.uint8)])), (int(x0), int(y)))

def icon_full(px, art=0.66):            # full-bleed square (iOS, Play): the store rounds the corners
    c = ink_bg(px, px); centered(c, fit(mark, round(px*art)), round(px*0.01)); return c
def icon_rounded(px):                    # legacy Android launcher icon
    c = Image.new('RGBA', (px, px), (0,0,0,0)); mask = Image.new('L', (px, px), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, px-1, px-1], radius=round(px*0.22), fill=255)
    c.paste(icon_full(px, 0.7), (0, 0), mask); return c
def icon_round(px):
    c = Image.new('RGBA', (px, px), (0,0,0,0)); mask = Image.new('L', (px, px), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, px-1, px-1], fill=255)
    c.paste(icon_full(px, 0.64), (0, 0), mask); return c
def adaptive_fg(px):                     # 108-unit canvas, art inside the 66-unit safe zone
    c = Image.new('RGBA', (px, px), (0,0,0,0)); centered(c, fit(mark, round(px*0.54)), round(px*0.01)); return c
def adaptive_bg(px): return ink_bg(px, px)
def splash(w, h):
    c = ink_bg(w, h); s = min(w, h)
    lg = fit(logo_d, round(min(w*0.78, s*1.25) if w > h else w*0.78)); centered(c, lg, -round(s*0.02))
    bw = lg.width*0.5; bar(c, (w-bw)/2, bw, (h+lg.height)//2 + round(s*0.03), max(4, round(s*0.012)))
    return c.convert('RGB')

# Android
for d, k in {'mdpi':1, 'hdpi':1.5, 'xhdpi':2, 'xxhdpi':3, 'xxxhdpi':4}.items():
    s = round(48*k); a = round(108*k); n = round(24*k)
    icon_rounded(s*4).resize((s, s), Image.LANCZOS).save(RES/f'mipmap-{d}/ic_launcher.png')
    icon_round(s*4).resize((s, s), Image.LANCZOS).save(RES/f'mipmap-{d}/ic_launcher_round.png')
    adaptive_fg(a).save(RES/f'mipmap-{d}/ic_launcher_foreground.png')
    adaptive_bg(a).save(RES/f'mipmap-{d}/ic_launcher_background.png')
    st = Image.new('RGBA', (n*4, n*4), (0,0,0,0)); centered(st, fit(solid(mark, (255,255,255)), round(n*4*0.94)))
    st.resize((n, n), Image.LANCZOS).save(RES/f'drawable-{d}/ic_stat_yhm.png')
for f in glob.glob(str(RES/'*/splash.png')):
    w, h = Image.open(f).size; splash(w, h).save(f)

# iPhone
icon_full(1024).convert('RGB').save(XC/'AppIcon.appiconset/AppIcon-512@2x.png')
for f in sorted((XC/'Splash.imageset').glob('splash-*.png')):
    c = ink_bg(2732, 2732); lg = fit(logo_d, 1180); centered(c, lg, -40); bar(c, 2732/2-295, 590, 1366+lg.height//2+40, 26)
    c.convert('RGB').save(f)

# Store graphics and in-app images
icon_full(512).convert('RGB').save(B/'play-icon.png')
icon_full(1024).save(B/'app-icon.png')
IMG = ROOT/'www/img'
fit(logo_l, 1200).save(IMG/'yhm-logo.webp', quality=90)
fit(logo_d, 1200).save(IMG/'yhm-logo-dark.webp', quality=90)
fit(mark, 360).save(IMG/'yhm-mark.webp', quality=92)

FEATURE = f'''<html><head><style>{(ROOT/"www/fonts.css").read_text().replace("url(fonts/","url(../www/fonts/")}
html,body{{margin:0}} .f{{width:1024px;height:500px;position:relative;overflow:hidden;color:#fff;font-family:Montserrat;
background:linear-gradient(90deg,rgba(18,21,18,.97) 0%,rgba(18,21,18,.9) 46%,rgba(18,21,18,.45) 100%),url(source/nehru-stadium.jpg) center/cover}}
.l{{position:absolute;left:52px;top:70px;width:520px}} .l img{{width:100%;display:block}}
.t{{position:absolute;left:56px;top:300px;right:40px}} .t b{{font-weight:800;font-size:54px;letter-spacing:1px;display:block;line-height:1}}
.t b i{{font-style:normal;color:#D7E21F}} .t p{{margin:14px 0 0;font-size:24px;font-weight:600;opacity:.92}}
.s{{position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(90deg,#D7E21F,#AED432,#7DC243)}}</style></head>
<body><div class="f"><div class="l"><img src="source/yhm2027/logo-dark.png"></div><div class="t"><b>YHM <i>COACH</i> 2027</b><p>5K · 10K · 21K plans · nutrition · reminders · watch sync</p></div><div class="s"></div></div></body></html>'''
async def feature():
    from playwright.async_api import async_playwright
    (B/'_tmp.html').write_text(FEATURE)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1024, 'height':500})
        await pg.goto('file://'+str(B/'_tmp.html')); await pg.wait_for_timeout(500)
        await pg.screenshot(path=str(B/'play-feature-graphic.png')); await b.close()
    (B/'_tmp.html').unlink()
asyncio.run(feature())
print('assets built')
