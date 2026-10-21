// Assembles www/index.html (the shared page) from src/v2: shell.html + lib.js + app.js.
import { readFileSync, writeFileSync } from 'node:fs';
const shell = readFileSync('src/v2/shell.html', 'utf8');
const js = readFileSync('src/v2/lib.js', 'utf8') + '\n' + readFileSync('src/v2/app.js', 'utf8');
writeFileSync('www/index.html', shell + '\n<script>\n(function(){\n"use strict";\n' + js + '\n})();\n</script>\n');
console.log('Assembled www/index.html');
