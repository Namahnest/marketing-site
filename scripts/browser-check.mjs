// Dependency-free Chrome DevTools smoke check. Start `hugo server` first.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const executable = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = process.env.SITE_URL || 'http://127.0.0.1:1313';
const profile = await mkdtemp(path.join(tmpdir(), 'namahnest-chrome-'));
const browser = spawn(executable, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=9223', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const failures = [];
let socket;
const assert = (condition, label) => { if (!condition) failures.push(label); console.log(`${condition ? 'PASS' : 'FAIL'}: ${label}`); };
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try { target = (await (await fetch('http://127.0.0.1:9223/json')).json()).find(tab => tab.type === 'page'); if (target) break; } catch {}
    await pause(200);
  }
  if (!target) throw new Error('Chrome debugging endpoint did not become available');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const pending = new Map();
  const browserErrors = [];
  let sequence = 0;
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const promise = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) promise.reject(message.error); else promise.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') browserErrors.push(message.params.exceptionDetails.text);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await call('Network.setCacheDisabled', { cacheDisabled: true });
  const navigate = async route => {
    await call('Page.navigate', { url: `${base}${route}` });
    await pause(450);
    for (let i = 0; i < 20; i++) {
      if (await evaluate(`document.readyState === 'complete' && !!document.querySelector('[data-theme-toggle]')`)) break;
      await pause(100);
    }
  };
  await mkdir('.reports', { recursive: true });
  if (!process.argv.includes('--audit-only') && !process.argv.includes('--brand-only')) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: width < 768 });
    for (const route of ['/', '/plans/', '/plans/atlas/', '/plans/launchpad/', '/plans/mono/', '/docs/', '/docs/getting-started/', '/pricing/', '/contact/']) {
      await navigate(route);
      const dimensions = await evaluate(`({ width: innerWidth, scroll: document.documentElement.scrollWidth, h1: document.querySelectorAll('h1').length })`);
      assert(dimensions.scroll <= dimensions.width + 1, `${route} has no horizontal overflow at ${width}px`);
      assert(dimensions.h1 === 1, `${route} has one H1 at ${width}px`);
      if (route === '/' && [390, 1440].includes(width)) {
        await pause(400);
        const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(`.reports/home-${width}.png`, Buffer.from(shot.data, 'base64'));
      }
    }
  }
  await navigate('/plans/?category=docs');
  assert(await evaluate(`document.querySelectorAll('[data-plan-category]:not([hidden])').length === 1 && document.querySelector('[data-filter="docs"]').getAttribute('aria-pressed') === 'true'`), 'Category URL filters documentation plans');
  await evaluate(`document.querySelector('[data-filter="landing"]').click()`);
  assert(await evaluate(`document.querySelector('[data-plan-category="landing"]').hidden === false && location.search.includes('landing')`), 'Plan filter changes visible cards and URL');
  await navigate('/pricing/');
  await evaluate(`document.querySelector('[data-billing="monthly"]').click()`);
  assert(await evaluate(`document.querySelector('[data-once-price]').textContent === '$19' && document.querySelector('[data-price-unit]').textContent === '/ month'`), 'Pricing switch displays monthly support');
  await navigate('/plans/atlas/');
  await evaluate(`document.querySelector('[data-gallery="detail"]').click(); document.querySelector('[data-support-toggle]').click()`);
  assert(await evaluate(`!document.querySelector('[data-gallery-panel="detail"]').hidden && document.querySelector('[data-buy-link]').href.includes('support=yes')`), 'Product gallery and support purchase selection work');
  await navigate('/docs/');
  await evaluate(`const input = document.getElementById('docs-search'); input.value = 'cloudflare'; input.dispatchEvent(new Event('input'))`);
  assert(await evaluate(`document.querySelectorAll('[data-doc-card]:not([hidden])').length > 0 && document.querySelectorAll('[data-doc-card]:not([hidden])').length < 6`), 'Documentation search filters guides');
  await navigate('/contact/?plan=Atlas%20Docs&support=yes');
  assert(await evaluate(`document.getElementById('interest').value === 'Atlas Docs' && document.getElementById('message').value.includes('monthly support')`), 'Contact form preserves selected kit and support');
  assert(await evaluate(`!document.getElementById('contact-form').checkValidity()`), 'Contact form rejects missing required details');
  await evaluate(`document.getElementById('name').value='Alex Morgan'; document.getElementById('email').value='alex@example.com'`);
  assert(await evaluate(`document.getElementById('contact-form').checkValidity()`), 'Contact form accepts valid project details');
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 950, deviceScaleFactor: 1, mobile: true });
  await navigate('/');
  await evaluate(`document.getElementById('menu-toggle').click()`);
  assert(await evaluate(`!document.getElementById('mobile-menu').hidden && document.getElementById('menu-toggle').getAttribute('aria-expanded') === 'true'`), 'Mobile navigation opens accessibly');
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  assert(await evaluate(`document.getElementById('mobile-menu').hidden`), 'Escape closes mobile navigation');
  await evaluate(`document.querySelector('[data-theme-toggle]').click()`);
  assert(await evaluate(`!document.documentElement.classList.contains('dark') && localStorage.getItem('namahnest-theme') === 'light'`), 'Light mode toggles and persists');
  await navigate('/');
  assert(await evaluate(`!document.documentElement.classList.contains('dark')`), 'Light theme persists after navigation');
  const lightShot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('.reports/home-light-390.png', Buffer.from(lightShot.data, 'base64'));
  await evaluate(`document.querySelector('details summary').click()`);
  assert(await evaluate(`document.querySelector('details').open`), 'FAQ disclosure opens');
  assert(browserErrors.length === 0, 'No browser JavaScript exceptions');
  }
  if (failures.length) throw new Error(`${failures.length} browser checks failed`);
  if (process.argv.includes('--brand-only')) {
    for (const width of [320, 1440]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: width < 768 });
      await navigate('/');
      assert(await evaluate(`document.querySelector('header svg').getAttribute('viewBox') === '0 0 48 48'`), `Website symbol renders before the wordmark at ${width}px`);
      assert(await evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`), `New logo fits at ${width}px`);
      const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(`.reports/new-logo-${width}.png`, Buffer.from(screenshot.data, 'base64'));
    }
    await call('Emulation.setDeviceMetricsOverride', { width: 800, height: 360, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: `${base}/images/brand/namahnest-preview.svg` });
    await pause(700);
    const preview = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile('static/images/brand/namahnest-preview.png', Buffer.from(preview.data, 'base64'));
    if (failures.length) throw new Error(`${failures.length} brand checks failed`);
  }
  if (process.argv.includes('--render-social')) {
    await call('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: `${base}/images/social-card.svg` });
    await pause(700);
    const social = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile('static/images/social-card.png', Buffer.from(social.data, 'base64'));
    console.log('Rendered static/images/social-card.png from the source SVG.');
  }
  if (process.argv.includes('--audit') || process.argv.includes('--audit-only')) {
    await navigate('/');
    await evaluate(`localStorage.setItem('namahnest-theme', 'dark')`);
    const { default: lighthouse } = await import('lighthouse');
    const result = await lighthouse(`${base}/`, {
      port: 9223,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    });
    await writeFile('.reports/lighthouse.json', result.report);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
    console.log('Lighthouse mobile scores:', scores);
    assert(scores.performance >= 95, 'Lighthouse performance meets the 95+ target');
    assert(scores.accessibility === 100 && scores.seo === 100, 'Lighthouse accessibility and SEO score 100');
    if (failures.length) throw new Error(`${failures.length} checks failed`);
  }
  console.log('All browser checks passed. Screenshots are in .reports/.');
} finally {
  socket?.close();
  browser.kill();
}
