# Builds the iPhone app icon (1024 px, opaque, full-bleed: iOS rounds the corners) and launch images.
import pathlib
from PIL import Image, ImageDraw
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT/'brand/source'; XC = ROOT/'ios/App/App/Assets.xcassets'
mark = Image.open(SRC/'yhm-mark.png').convert('RGBA'); logo = Image.open(SRC/'yhm-logo.png').convert('RGBA')
COLS = [(27,64,116), (239,126,20), (1,160,226)]
fit = lambda img, w: img.resize((w, round(w*img.height/img.width)), Image.LANCZOS)
def centered(c, img, dy=0): c.alpha_composite(img, ((c.width-img.width)//2, (c.height-img.height)//2+dy))
def bars(c, x0, w, y, h):
    d = ImageDraw.Draw(c)
    for i, col in enumerate(COLS): d.rectangle([round(x0+i*w/3), y, round(x0+(i+1)*w/3), y+h], fill=col)

icon = Image.new('RGBA', (1024,1024), (255,255,255,255))
centered(icon, fit(mark, 800), -40); bars(icon, 150, 724, 760, 56)
icon.convert('RGB').save(XC/'AppIcon.appiconset/AppIcon-512@2x.png')

for f in sorted((XC/'Splash.imageset').glob('splash-*.png')):
    c = Image.new('RGBA', (2732,2732), (255,255,255,255))
    centered(c, fit(logo, 1000), -60); bars(c, 916, 900, 1700, 22)
    c.convert('RGB').save(f)
print('iOS icon and splash written')
