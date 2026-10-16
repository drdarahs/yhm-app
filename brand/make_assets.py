# Builds Android icons, splash screens and Play Store graphics from the official logos in brand/source.
import pathlib, glob, asyncio
from PIL import Image, ImageDraw
ROOT = pathlib.Path(__file__).resolve().parent.parent
B = ROOT/'brand'; SRC = B/'source'; RES = ROOT/'android/app/src/main/res'
mark = Image.open(SRC/'yhm-mark.png').convert('RGBA')
logo = Image.open(SRC/'yhm-logo.png').convert('RGBA')
NAVY, ORANGE, SKY = (27,64,116), (239,126,20), (1,160,226)

def fit(img, w):
    return img.resize((w, round(w*img.height/img.width)), Image.LANCZOS)
def centered(canvas, img, dy=0):
    canvas.alpha_composite(img, ((canvas.width-img.width)//2, (canvas.height-img.height)//2+dy))
def stripe(canvas, h):
    d = ImageDraw.Draw(canvas); w = canvas.width
    for i, c in enumerate((NAVY, ORANGE, SKY)):
        d.rectangle([round(i*w/3), canvas.height-h, round((i+1)*w/3), canvas.height], fill=c)

def adaptive_fg(px):            # 108-unit canvas, art inside the 66-unit safe circle
    c = Image.new('RGBA', (px, px), (255,255,255,0)); centered(c, fit(mark, round(px*0.56)), -round(px*0.03)); return c
def adaptive_bg(px):
    c = Image.new('RGBA', (px, px), (255,255,255,255))
    d = ImageDraw.Draw(c); h = round(px*0.035); x0 = px*0.24; w = px*0.52; y = round(px*0.645)
    for i, col in enumerate((NAVY, ORANGE, SKY)):
        d.rectangle([round(x0+i*w/3), y, round(x0+(i+1)*w/3), y+h], fill=col)
    return c
def square(px):
    c = Image.new('RGBA', (px, px), (0,0,0,0))
    ImageDraw.Draw(c).rounded_rectangle([0,0,px-1,px-1], radius=round(px*0.22), fill=(255,255,255,255))
    centered(c, fit(mark, round(px*0.84)), -round(px*0.03)); stripe_mask = Image.new('RGBA',(px,px),(0,0,0,0))
    d = ImageDraw.Draw(c); h = round(px*0.06); y = round(px*0.74)
    for i, col in enumerate((NAVY, ORANGE, SKY)):
        d.rectangle([round(px*0.12+i*px*0.76/3), y, round(px*0.12+(i+1)*px*0.76/3), y+h], fill=col)
    return c
def roundi(px):
    c = Image.new('RGBA', (px, px), (0,0,0,0))
    ImageDraw.Draw(c).ellipse([0,0,px-1,px-1], fill=(255,255,255,255))
    centered(c, fit(mark, round(px*0.74)), -round(px*0.02)); return c

dens = {'mdpi':1,'hdpi':1.5,'xhdpi':2,'xxhdpi':3,'xxxhdpi':4}
for d, k in dens.items():
    s = round(48*k); a = round(108*k)
    square(s*4).resize((s,s), Image.LANCZOS).save(RES/f'mipmap-{d}/ic_launcher.png')
    roundi(s*4).resize((s,s), Image.LANCZOS).save(RES/f'mipmap-{d}/ic_launcher_round.png')
    adaptive_fg(a).save(RES/f'mipmap-{d}/ic_launcher_foreground.png')
    adaptive_bg(a).save(RES/f'mipmap-{d}/ic_launcher_background.png')

for f in glob.glob(str(RES/'*/splash.png')):
    w, h = Image.open(f).size
    c = Image.new('RGBA', (w, h), (255,255,255,255))
    centered(c, fit(logo, round(min(w,h)*0.62)), -round(min(w,h)*0.04)); stripe(c, max(4, round(min(w,h)*0.025)))
    c.convert('RGB').save(f)

big = Image.new('RGBA', (512,512), (255,255,255,255)); centered(big, fit(mark, 430), -20)
d = ImageDraw.Draw(big)
for i, col in enumerate((NAVY, ORANGE, SKY)): d.rectangle([round(56+i*400/3), 360, round(56+(i+1)*400/3), 384], fill=col)
big.convert('RGB').save(B/'play-icon.png')
for n in ('logo','icon-square','adaptive-bg','adaptive-fg','splash-port','splash-land'):
    (B/f'{n}.png').unlink(missing_ok=True)
square(1024).save(B/'app-icon.png')

FEATURE = f'''<html><head><style>{(ROOT/"www/fonts.css").read_text().replace("url(fonts/","url(../www/fonts/")}
html,body{{margin:0}} .f{{width:1024px;height:500px;position:relative;overflow:hidden;color:#fff;font-family:Mukta;
background:linear-gradient(90deg,rgba(13,36,72,.96) 0%,rgba(17,43,84,.85) 48%,rgba(17,43,84,.35) 100%),url(source/nehru-stadium.jpg) center/cover}}
.card{{position:absolute;left:50px;top:84px;width:350px;background:#fff;border-radius:28px;padding:20px 24px}} .card img{{width:100%;display:block}}
.t{{position:absolute;left:470px;top:104px;right:36px}} .t b{{font-family:"Barlow Condensed";font-weight:800;font-size:90px;line-height:.9;letter-spacing:2px;display:block}}
.t p{{margin:14px 0 0;font-size:30px;font-weight:600;line-height:1.25}} .t small{{display:block;margin-top:12px;font-size:23px;opacity:.9}}
.s{{position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(90deg,#1b4074 0 33%,#ef7e14 33% 66%,#01a0e2 66%)}}</style></head>
<body><div class="f"><div class="card"><img src="source/yhm-logo.png"></div><div class="t"><b>YHM COACH</b><p>Train for Yavatmal Health Marathon 2027</p>
<small>5K · 10K · 21K plans · nutrition · reminders · watch sync</small></div><div class="s"></div></div></body></html>'''
async def feature():
    from playwright.async_api import async_playwright
    (B/'_tmp.html').write_text(FEATURE)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1024,'height':500})
        await pg.goto('file://'+str(B/'_tmp.html')); await pg.wait_for_timeout(400)
        await pg.screenshot(path=str(B/'play-feature-graphic.png')); await b.close()
    (B/'_tmp.html').unlink()
asyncio.run(feature())
print('assets built')
