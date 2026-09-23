import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
function setup(fetchResult) {
  let submit, resets = 0, calls = 0, payload;
  const status = { textContent: '' }, button = { innerHTML: 'Send your message', disabled: false };
  const website = { value: '' }, botcheck = { checked: false };
  const form = {
    action: 'https://api.web3forms.com/submit',
    hasAttribute: name => ['action', 'data-web3forms'].includes(name),
    reportValidity: () => true,
    elements: { namedItem: () => botcheck },
    querySelector: () => button,
    addEventListener: (event, listener) => { submit = listener; },
    setAttribute() {}, removeAttribute() {}, reset() { resets++; }
  };
  const fields = { 'contact-form': form, interest: { options: [] }, website, 'contact-status': status };
  runInNewContext(source, {
    document: {
      documentElement: { classList: { contains: () => false } },
      querySelector: () => null, querySelectorAll: () => [],
      getElementById: id => fields[id] || null, addEventListener() {}
    },
    location: { search: '' }, URLSearchParams, AbortController, setTimeout, clearTimeout,
    FormData: class { [Symbol.iterator]() { return Object.entries({ name: 'Test Visitor', email: 'test@example.com', interest: 'Atlas Docs', message: 'A sample project enquiry.', access_key: 'test-key', website: '' })[Symbol.iterator](); } },
    fetch: async (url, options) => { calls++; payload = JSON.parse(options.body); return fetchResult(url, options); }
  });
  return { form, status, button, website, botcheck, submit: () => submit({ preventDefault() {} }), get resets() { return resets; }, get calls() { return calls; }, get payload() { return payload; } };
}

test('successful submission sends project fields and resets only on confirmed success', async () => {
  const app = setup(async url => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    return { ok: true, json: async () => ({ success: true }) };
  });
  await app.submit();
  assert.equal(app.payload.access_key, 'test-key');
  assert.equal(app.payload.subject, 'NamahNest enquiry: Atlas Docs');
  assert.equal(app.payload.email, 'test@example.com');
  assert.equal('website' in app.payload, false);
  assert.equal(app.resets, 1);
  assert.match(app.status.textContent, /message has been sent/);
  assert.equal(app.button.disabled, false);
});

for (const [label, response] of [
  ['API rejection', async () => ({ ok: true, json: async () => ({ success: false }) })],
  ['HTTP failure', async () => ({ ok: false, json: async () => ({ success: true }) })],
  ['invalid JSON', async () => ({ ok: true, json: async () => { throw Error('Invalid JSON'); } })],
  ['network error', async () => { throw Error('Offline'); }],
  ['timeout', async () => { throw Object.assign(Error('Timeout'), { name: 'AbortError' }); }]
]) test(`${label} retains input and restores the send button`, async () => {
  const app = setup(response);
  await app.submit();
  assert.equal(app.resets, 0);
  assert.match(app.status.textContent, /details are still here/);
  assert.equal(app.button.disabled, false);
  assert.equal(app.button.innerHTML, 'Send your message');
});

test('spam traps and invalid input prevent requests', async () => {
  const app = setup(() => { throw Error('Should not send'); });
  app.website.value = 'spam'; await app.submit();
  app.website.value = ''; app.botcheck.checked = true; await app.submit();
  app.botcheck.checked = false; app.form.reportValidity = () => false; await app.submit();
  assert.equal(app.calls, 0);
});

test('a second submit does not duplicate an in-flight request', async () => {
  let finish;
  const app = setup(() => new Promise(resolve => { finish = resolve; }));
  const first = app.submit();
  assert.equal(app.button.disabled, true);
  await app.submit();
  assert.equal(app.calls, 1);
  finish({ ok: true, json: async () => ({ success: true }) });
  await first;
  assert.equal(app.button.disabled, false);
});
