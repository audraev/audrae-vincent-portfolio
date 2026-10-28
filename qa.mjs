import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const out = resolve('.local/qa');
await mkdir(out, { recursive: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9333', '--remote-allow-origins=http://localhost:9333', `--user-data-dir=${resolve('.local/chrome-qa')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { tabs = await (await fetch('http://127.0.0.1:9333/json')).json(); break; }
    catch { await new Promise(r => setTimeout(r, 200)); }
  }
  if (!tabs) throw new Error('Browser did not start');
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail; });
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = ({ data }) => {
    const result = JSON.parse(data);
    if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.text);
    if (pending.has(result.id)) {
      const { ok, fail } = pending.get(result.id);
      pending.delete(result.id);
      result.error ? fail(new Error(JSON.stringify(result.error))) : ok(result.result);
    }
  };
  const send = (method, params = {}) => new Promise((ok, fail) => { const request = ++id; pending.set(request, { ok, fail }); socket.send(JSON.stringify({ id: request, method, params })); });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173' });
  await new Promise(r => setTimeout(r, 1800));
  await evaluate('document.fonts.ready');
  const results = [];
  async function check(name, expression) { const passed = await evaluate(expression); results.push({ name, passed }); if (!passed) throw new Error('Check failed: ' + name); }
  await check('Title and two real projects', `document.title.includes('Audrae Vincent') && document.querySelectorAll('.project').length === 2`);
  await check('Desktop has no horizontal overflow', 'document.documentElement.scrollWidth <= innerWidth');
  await check('App filter', `document.querySelector('[data-filter="app"]').click(); document.querySelectorAll('.project:not([hidden])').length === 1 && !document.querySelector('[data-category="app"]').hidden`);
  await check('Website filter', `document.querySelector('[data-filter="website"]').click(); document.querySelectorAll('.project:not([hidden])').length === 1 && !document.querySelector('[data-category="website"]').hidden`);
  await check('Reset project filter', `document.querySelector('[data-filter="all"]').click(); document.querySelectorAll('.project:not([hidden])').length === 2`);
  for (const project of ['fitness', 'artheon']) {
    await check(project + ' detail and GitHub link', `document.querySelector('[data-project="${project}"]').click(); document.querySelector('dialog').open && document.querySelector('#dialog-content a').href.startsWith('https://github.com/audraev/')`);
    await evaluate(`document.querySelector('#close-dialog').click(); new Promise(resolve => setTimeout(resolve, 60))`);
    await check(project + ' dialog close', `!document.querySelector('dialog').open && !document.body.classList.contains('modal-open')`);
  }
  await evaluate('window.scrollTo(0,0)');
  let shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile(resolve(out, 'desktop.png'), Buffer.from(shot.data, 'base64'));
  for (const width of [390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
    await check(width + 'px has no horizontal overflow', 'document.documentElement.scrollWidth <= innerWidth');
    await check(width + 'px mobile navigation opens', `document.querySelector('.menu-toggle').click(); document.querySelector('#navigation').classList.contains('is-open') && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`);
    await check(width + 'px navigation closes after selection', `document.querySelector('#navigation a').click(); !document.querySelector('#navigation').classList.contains('is-open')`);
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate('window.scrollTo(0,0)');
  await new Promise(r => setTimeout(r, 300));
  shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile(resolve(out, 'mobile.png'), Buffer.from(shot.data, 'base64'));
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  await check('Print view includes experience and hides interactive projects', `getComputedStyle(document.querySelector('.experience-section')).display !== 'none' && getComputedStyle(document.querySelector('.projects-section')).display === 'none'`);
  if (errors.length) throw new Error('Browser errors: ' + errors.join(', '));
  await writeFile(resolve(out, 'results.json'), JSON.stringify({ results, errors }, null, 2));
  process.stdout.write(JSON.stringify({ passed: results.length, browserErrors: errors.length, screenshots: out }) + '\n');
  await send('Browser.close');
} finally {
  socket?.close();
  chrome.kill();
}
