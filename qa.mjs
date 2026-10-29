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
    await evaluate('document.querySelector(".slide-image").decode()');
    const firstImage = await evaluate('document.querySelector(".slide-image").src');
    const total = project === 'fitness' ? 3 : 4;
    await check(project + ' starts with a loaded preview and one selected thumbnail', `document.querySelector('.slide-image').naturalWidth === 1280 && document.querySelector('.gallery-counter').textContent === '1 / ${total}' && document.querySelectorAll('.gallery-thumbnail[aria-pressed="true"]').length === 1`);
    await evaluate('document.querySelector(".gallery-controls").lastElementChild.click(); document.querySelector(".slide-image").decode()');
    await check(project + ' next slide changes the screenshot and caption', `document.querySelector('.slide-image').src !== ${JSON.stringify(firstImage)} && document.querySelector('.gallery-counter').textContent === '2 / ${total}' && document.querySelector('.slide-kicker').textContent.startsWith('SCREEN 02')`);
    await evaluate('document.querySelector(".gallery-controls").firstElementChild.click(); document.querySelector(".gallery-controls").firstElementChild.click()');
    await check(project + ' previous slide wraps to the last screenshot', `document.querySelector('.gallery-counter').textContent === '${total} / ${total}'`);
    await evaluate('document.querySelectorAll(".gallery-thumbnail")[1].click()');
    await check(project + ' thumbnails select a slide', `document.querySelector('.gallery-counter').textContent === '2 / ${total}' && document.querySelectorAll('.gallery-thumbnail')[1].getAttribute('aria-pressed') === 'true'`);
    await evaluate('document.querySelector(".project-gallery").focus()');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home' });
    await check(project + ' keyboard navigation returns to the first slide', `document.querySelector('.slide-image').src === ${JSON.stringify(firstImage)} && document.querySelector('.gallery-counter').textContent === '1 / ${total}'`);
    const paths = await evaluate('Array.from(document.querySelectorAll(".gallery-thumbnail img"), image => image.src)');
    for (const url of paths) {
      await check(project + ' screenshot asset loads: ' + url.split('/').at(-1), `fetch(${JSON.stringify(url)}).then(response => response.ok && response.headers.get('content-type').startsWith('image/'))`);
    }
    await evaluate('document.querySelector(".slide-image").decode(); document.querySelector("dialog").scrollTop = 0');
    await evaluate('new Promise(resolve => setTimeout(resolve, 150))');
    const projectShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(resolve(out, project + '-gallery-desktop.png'), Buffer.from(projectShot.data, 'base64'));
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
    await evaluate('document.querySelector("[data-project=fitness]").click(); document.querySelector(".slide-image").decode()');
    await check(width + 'px gallery stays within the dialog', 'document.querySelector("dialog").scrollWidth <= document.querySelector("dialog").clientWidth && document.documentElement.scrollWidth <= innerWidth');
    await check(width + 'px gallery has accessible touch targets', 'Array.from(document.querySelectorAll(".gallery-arrow"), button => button.getBoundingClientRect().width >= 44 && button.getBoundingClientRect().height >= 44).every(Boolean)');
    if (width === 390) {
      await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
      const bounds = await evaluate('(() => { const r = document.querySelector(".slide-image-wrap").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })()');
      const y = bounds.y + bounds.height / 2;
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bounds.x + bounds.width * .75, y }] });
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: bounds.x + bounds.width * .5, y }] });
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: bounds.x + bounds.width * .25, y }] });
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await check('Touch swipe advances the mobile gallery', 'document.querySelector(".gallery-counter").textContent === "2 / 3"');
      await evaluate('document.querySelector("dialog").scrollTop = 0');
      const galleryShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(resolve(out, 'gallery-mobile.png'), Buffer.from(galleryShot.data, 'base64'));
      await send('Emulation.setTouchEmulationEnabled', { enabled: false });
    }
    await evaluate('document.querySelector("dialog").scrollTop = 10000');
    await check(width + 'px close control stays visible when the dialog scrolls', '(() => { const r = document.querySelector("#close-dialog").getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await evaluate('new Promise(resolve => setTimeout(resolve, 60))');
    await check(width + 'px Escape closes the gallery and restores focus', '!document.querySelector("dialog").open && document.activeElement.matches("[data-project=fitness]")');
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
