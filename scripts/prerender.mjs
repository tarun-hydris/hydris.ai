/* Pre-render: after the client build, render each page to HTML and place it inside #root.
   Run by `npm run build`; the SSR bundle is built to dist-ssr and removed afterwards. */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);

const files = ['index.html', 'platform/index.html', 'demo/index.html', 'about/index.html', 'press/index.html',
  'contact/index.html', 'privacy/index.html', 'terms/index.html', '404.html'];

for (const f of files) {
  const path = resolve(root, 'dist', f);
  const html = readFileSync(path, 'utf8');
  const key = (html.match(/<body[^>]*data-page="([^"]+)"/) || [])[1] || 'notfound';
  const body = render(key);
  if (!html.includes('<div id="root"></div>')) throw new Error(`No empty #root in ${f}`);
  writeFileSync(path, html.replace('<div id="root"></div>', `<div id="root">${body}</div>`));
  console.log(`prerendered ${f.padEnd(22)} ${(body.length / 1024).toFixed(0)} kB`);
}
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
