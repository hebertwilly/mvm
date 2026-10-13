// Valida a saída do build e o script real do componente em DOM simulado.
// Não abre destinos externos nem envia mensagens; não substitui um navegador.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { contact, getWhatsAppUrl } from '../src/config/contact.js';

const expectedMessages = {
  general: 'Olá! Vim pelo site da MVM e gostaria de mais informações.',
  quote: 'Olá! Vim pelo site da MVM e gostaria de solicitar um orçamento.',
  safety: 'Olá! Vim pelo site da MVM e gostaria de informações sobre segurança do trabalho.',
  occupational: 'Olá! Vim pelo site da MVM e gostaria de informações sobre medicina ocupacional.',
  onsite: 'Olá! Vim pelo site da MVM e gostaria de informações sobre atendimento in loco.',
  safetyProposal: 'Olá! Vim pelo site da MVM e gostaria de solicitar uma proposta de segurança do trabalho.',
  occupationalExams: 'Olá! Vim pelo site da MVM e gostaria de informações sobre medicina ocupacional e exames médicos.',
  onsiteCompany: 'Olá! Vim pelo site da MVM e gostaria de informações sobre atendimento in loco na minha empresa.',
};
assert.deepEqual(contact.messages, expectedMessages);
for (const [key, message] of Object.entries(expectedMessages)) {
  const url = new URL(getWhatsAppUrl(key));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${contact.whatsappNumber}`);
  assert.equal(url.search, `?text=${encodeURIComponent(message)}`);
  assert.equal(url.searchParams.get('text'), message);
}
assert.equal(getWhatsAppUrl('unknown'), getWhatsAppUrl('general'));
const testNumber = contact.whatsappNumber;
try {
  contact.whatsappNumber = null;
  assert.equal(getWhatsAppUrl(), null);
  contact.whatsappNumber = 'invalid';
  assert.equal(getWhatsAppUrl(), null);
} finally {
  contact.whatsappNumber = testNumber;
}
const sourceRoot = new URL('../src/', import.meta.url);
const numberFiles = fs.readdirSync(sourceRoot, { recursive: true })
  .filter((file) => /\.(?:js|astro|css)$/.test(file))
  .filter((file) => fs.readFileSync(new URL(file.replaceAll('\\', '/'), sourceRoot), 'utf8').includes(testNumber));
assert.deepEqual(numberFiles.map((file) => file.replaceAll('\\', '/')), ['config/contact.js']);

const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const ctas = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
  .filter(([, attributes]) => attributes.includes('https://wa.me/'));
assert.equal(ctas.length, 4);
const expectedCtas = new Map([
  ['Fale conosco', 'general'],
  ['Solicitar um orçamento', 'quote'],
  ['Consultar atendimento in loco', 'onsite'],
  ['Falar com a MVM no WhatsApp', 'general'],
]);
for (const [, attributes, content] of ctas) {
  const label = content.match(/class="button-label"[^>]*>([^<]+)</)?.[1]
    ?? content.match(/<span>([^<]+)<\/span>/)?.[1];
  assert.ok(expectedCtas.has(label));
  assert.equal(attributes.match(/href="([^"]+)"/)[1], getWhatsAppUrl(expectedCtas.get(label)));
  assert.ok(attributes.includes('target="_blank"'));
  assert.ok(attributes.includes('rel="noopener noreferrer"'));
  expectedCtas.delete(label);
}
assert.equal(expectedCtas.size, 0);
for (const href of ['/servicos/seguranca-do-trabalho/', '/servicos/medicina-ocupacional/', '/servicos/atendimento-in-loco/', '/#sobre']) {
  assert.ok(html.includes(`href="${href}"`));
}
const panelMarkup = html.match(/<mvm-whatsapp-contact\b[\s\S]*?<\/mvm-whatsapp-contact>/)[0];
assert.equal((html.match(/<mvm-whatsapp-contact\b/g) ?? []).length, 1);
assert.match(panelMarkup, /role="dialog"[^>]+hidden/);
assert.match(panelMarkup, /aria-expanded="false" aria-controls="whatsapp-contact-panel"/);
assert.match(panelMarkup, /data-continue disabled/);
const radios = [...panelMarkup.matchAll(/<label\b[^>]*><input\b([^>]*)><span[^>]*>([^<]+)<\/span><\/label>/g)];
assert.equal(radios.length, 4);
const topics = ['safety', 'occupational', 'onsite', 'general'];
radios.forEach(([, attributes], index) => {
  assert.ok(attributes.includes('type="radio" name="whatsapp-subject"'));
  assert.ok(!/\bchecked\b|\bdisabled\b/.test(attributes));
  assert.equal(attributes.match(/value="([^"]+)"/)[1], getWhatsAppUrl(topics[index]));
});

// Executa o JavaScript emitido pelo Astro, com window.open substituído por registro.
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(([, body]) => body).find((body) => body.includes('mvm-whatsapp-contact'));
assert.ok(script, 'Script do flutuante presente na saída estática');
const document = new EventTarget();
const opened = [];
class Element extends EventTarget {
  hidden = true;
  attributes = new Map();
  scrollTop = 0;
  setAttribute(name, value) { this.attributes.set(name, value); }
  focus() { document.activeElement = this; }
  querySelector(selector) { return this.controls?.get(selector) ?? null; }
}
class Button extends Element { disabled = false; }
const registry = new Map();
vm.runInNewContext(script, {
  HTMLElement: Element, HTMLButtonElement: Button, AbortController,
  document, window: { open: (...args) => opened.push(args) },
  customElements: { get: (name) => registry.get(name), define: (name, value) => registry.set(name, value) },
});
const Widget = registry.get('mvm-whatsapp-contact');
const widget = new Widget();
const launcher = new Button();
const panel = new Element();
const close = new Button();
const next = new Button();
next.disabled = true;
widget.controls = new Map([
  ['[data-launcher]', launcher], ['.whatsapp-panel', panel],
  ['[data-close]', close], ['[data-continue]', next],
]);
widget.connectedCallback();
assert.equal(launcher.hidden, false);
assert.equal(panel.hidden, true);
assert.equal(next.disabled, true);
assert.equal(document.activeElement, undefined);
const click = (target) => target.dispatchEvent(new Event('click'));
click(next);
assert.equal(opened.length, 0);
click(launcher);
assert.equal(panel.hidden, false);
assert.equal(launcher.attributes.get('aria-expanded'), 'true');
assert.equal(document.activeElement, close);
for (const key of topics) {
  widget.controls.set('input:checked', { value: getWhatsAppUrl(key) });
  widget.dispatchEvent(new Event('change'));
  assert.equal(next.disabled, false);
  click(next);
  assert.deepEqual(opened.at(-1), [getWhatsAppUrl(key), '_blank', 'noopener,noreferrer']);
}
assert.equal(opened.length, 4);
const escape = new Event('keydown', { cancelable: true });
Object.defineProperty(escape, 'key', { value: 'Escape' });
document.dispatchEvent(escape);
assert.equal(escape.defaultPrevented, true);
assert.equal(panel.hidden, true);
assert.equal(launcher.attributes.get('aria-expanded'), 'false');
assert.equal(document.activeElement, launcher);
panel.scrollTop = 300;
click(launcher);
assert.equal(panel.scrollTop, 0);
click(close);
assert.equal(panel.hidden, true);
assert.equal(document.activeElement, launcher);
click(launcher);
click(launcher);
assert.equal(panel.hidden, true);
assert.equal(document.activeElement, launcher);
widget.disconnectedCallback();
click(launcher);
assert.equal(panel.hidden, true);
widget.connectedCallback();
click(launcher);
assert.equal(panel.hidden, false);
click(close);
widget.disconnectedCallback();
console.log('OK: fonte única do telefone, 4 CTAs, 4 assuntos, mensagens, encodeURIComponent e links internos.');
console.log('OK em DOM simulado: estado inicial, seleção, abertura manual, Escape, fechar, foco, reconexão e destino sem envio.');
console.log('Sem navegador: responsividade, teclado nativo e aparência ainda precisam de conferência visual.');
