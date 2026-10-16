# Renders the YHM Coach brand art (SVG) to PNGs with headless Chromium.
import asyncio, pathlib
from playwright.async_api import async_playwright
B = pathlib.Path(__file__).parent
RUNNER = '''<g fill="none" stroke="#fff" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">
<path d="M34.5 22.5L29.5 33"/><path d="M33.5 25l6.5 3.5 3.5-4"/><path d="M33.5 25l-6.5 1-3 5"/>
<path d="M29.5 33l7.5 4.5-.8 7.5"/><path d="M29.5 33l-4.5 7-7 1.5"/></g><circle cx="37" cy="16.5" r="4.3" fill="#fff"/>'''
GRAD = '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1694"/><stop offset=".55" stop-color="#c22f86"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient></defs>'
SUN = '<path d="M15 45a17 17 0 0 1 34 0z" fill="#ffd25a"/><rect x="8" y="45" width="48" height="2.6" rx="1.3" fill="#fff" fill-opacity=".85"/>'
ART = {
 # circle logo (round launcher icon, in-app mark)
 "logo": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'+GRAD+'<circle cx="32" cy="32" r="32" fill="url(#g)"/>'+SUN+RUNNER.format(w=4.2)+'</svg>', 1024),
 # square launcher icon (legacy)
 "icon-square": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'+GRAD+'<rect width="64" height="64" rx="14" fill="url(#g)"/>'+SUN+RUNNER.format(w=4.2)+'</svg>', 1024),
 # full-bleed square for Play Store (no rounding; Play applies its own mask)
 "play-icon": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'+GRAD+'<rect width="64" height="64" fill="url(#g)"/><g transform="translate(6.4 6.4) scale(.8)">'+SUN+RUNNER.format(w=4.2)+'</g></svg>', 512),
 # adaptive icon layers (108 units; art kept inside the 66-unit safe zone)
 "adaptive-bg": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">'+GRAD.replace('id="g"','id="g" gradientUnits="objectBoundingBox"')+'<rect width="108" height="108" fill="url(#g)"/></svg>', 432),
 "adaptive-fg": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><g transform="translate(22 22)">'+SUN+RUNNER.format(w=4.2)+'</g></svg>', 432),
 # notification icon: white only, transparent
 "notif": ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 48 48"><path d="M15 45a17 17 0 0 1 34 0z" fill="none" stroke="#fff" stroke-width="3"/>'+RUNNER.format(w=4.6)+'</svg>', 96),
}
SPLASH = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1694"/><stop offset=".55" stop-color="#7a2bbf"/><stop offset=".8" stop-color="#d42f7f"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient>{G}</defs>
<rect width="{W}" height="{H}" fill="url(#s)"/>
<g transform="translate({cx} {cy}) scale({k}) translate(-32 -32)"><circle cx="32" cy="32" r="32" fill="url(#g)"/>{SUN}{R}</g>
<text x="{tx}" y="{ty}" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="{fs}" letter-spacing="2" fill="#fff">YHM COACH</text>
<text x="{tx}" y="{ty2}" text-anchor="middle" font-family="Mukta" font-weight="500" font-size="{fs2}" fill="#fff" fill-opacity=".9">Yavatmal Health Marathon 2027</text>
</svg>'''
FEATURE = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
<defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1694"/><stop offset=".5" stop-color="#8a2bb8"/><stop offset=".8" stop-color="#d42f7f"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient>{G}</defs>
<rect width="1024" height="500" fill="url(#s)"/><circle cx="820" cy="420" r="210" fill="#ffd25a" fill-opacity=".18"/><circle cx="820" cy="420" r="130" fill="#ffd25a"/>
<path d="M0 410 Q260 360 512 400 T1024 395 V500 H0z" fill="#1a0f52" fill-opacity=".5"/>
<g transform="translate(70 70) scale(2.6)"><circle cx="32" cy="32" r="32" fill="url(#g)"/>{SUN}{R}</g>
<text x="270" y="170" font-family="Barlow Condensed" font-weight="800" font-size="104" letter-spacing="3" fill="#fff">YHM COACH</text>
<text x="274" y="228" font-family="Mukta" font-weight="600" font-size="38" fill="#fff">Train for Yavatmal Health Marathon 2027</text>
<text x="274" y="276" font-family="Mukta" font-weight="400" font-size="28" fill="#fff" fill-opacity=".9">5K · 10K · 21K plans · nutrition · reminders · watch sync</text>
</svg>'''
FONTS = (B.parent/"www"/"fonts.css").read_text().replace("url(fonts/","url(../www/fonts/")
async def shot(page, svg, w, h, out, transparent=False):
    html = "<html><head><style>"+FONTS+"html,body{margin:0;background:transparent}svg{display:block;width:"+str(w)+"px;height:"+str(h)+"px}</style></head><body>"+svg+"</body></html>"
    (B/"_tmp.html").write_text(html)
    await page.set_viewport_size({"width": w, "height": h})
    await page.goto("file://"+str(B/"_tmp.html")); await page.wait_for_timeout(250)
    await page.screenshot(path=str(B/out), omit_background=transparent, clip={"x":0,"y":0,"width":w,"height":h})
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        for name,(svg,size) in ART.items():
            await shot(pg, svg, size, size, name+".png", transparent=name in ("logo","icon-square","adaptive-fg","notif"))
        for name,(W,H) in {"splash-port":(1280,1920),"splash-land":(1920,1280)}.items():
            m=min(W,H); k=m*0.22/64; cx=W/2; cy=H/2-m*0.08
            svg=SPLASH.format(W=W,H=H,G=GRAD,SUN=SUN,R=RUNNER.format(w=4.2),cx=cx,cy=cy,k=k,tx=W/2,ty=cy+m*0.22,ty2=cy+m*0.22+m*0.06,fs=round(m*0.085),fs2=round(m*0.035))
            await shot(pg, svg, W, H, name+".png")
        await shot(pg, FEATURE.format(G=GRAD,SUN=SUN,R=RUNNER.format(w=4.2)), 1024, 500, "play-feature-graphic.png")
        await b.close()
    (B/"_tmp.html").unlink()
asyncio.run(main())
print("rendered")
