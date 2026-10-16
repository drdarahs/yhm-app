// Builds the app's web folder (app-www) from the shared page in www/.
// - wraps the page in a full HTML document
// - swaps Google Fonts for the bundled offline fonts
// - adds the native bridge (src/native.js, bundled with esbuild)
// - adds the privacy policy page that Health Connect links to
import { build } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'app-www';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('www', OUT, { recursive: true, filter: (src) => !src.endsWith('_preview.html') });
cpSync('app/privacypolicy.html', `${OUT}/privacypolicy.html`);

let page = readFileSync('www/index.html', 'utf8');
page = page.replace(/<link id="gfonts"[^>]*>/, '<link rel="stylesheet" href="fonts.css">');
page = page.replace('<script>', '<script src="native.js"></script>\n<script>');
const head = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<meta name="theme-color" content="#2a1694">' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}' +
  'body{margin:0;font:14px system-ui,-apple-system,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' +
  '</head><body>';
writeFileSync(`${OUT}/index.html`, head + page + '</body></html>');

await build({
  entryPoints: ['src/native.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  target: ['chrome90'],
  outfile: `${OUT}/native.js`,
});
console.log('Built', OUT);
