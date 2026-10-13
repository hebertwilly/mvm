// Verifica o build estático e o script real do header em DOM simulado.
// Não comprova aparência, hover físico, teclado nativo ou responsividade.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { services } from '../src/config/services.js';
import { contact, getEmailUrl, getWhatsAppUrl } from '../src/config/contact.js';
import { getNavigationCurrent } from '../src/config/navigation.js';
import { homeSlides, serviceSlides, individualBanners } from '../src/config/bannerSlides.js';
import { officeAddress, officeMapEmbedUrl, officeDirectionsUrl } from '../src/config/location.js';

const root = new URL('../dist/', import.meta.url);
const routes = ['/', '/sobre-nos/', '/contato/', '/servicos/', ...services.map(({ href }) => href)];
const pages = new Map(routes.map((route) => [route, fs.readFileSync(new URL(`${route.slice(1)}index.html`, root), 'utf8')]));
const titles = new Set();
const descriptions = new Set();
const expectedNavigation = ['/', '/sobre-nos/', '/servicos/', '/contato/'];
for (const [route, html] of pages) {
  const serviceCards = [...html.matchAll(/<article class="service-card-item" data-motion="card">([\s\S]*?)<\/article>/g)];
  assert.equal(serviceCards.length, route === '/' || route === '/servicos/' ? 3 : route.startsWith('/servicos/') ? 2 : 0, `${route}: quantidade de cards de serviços`);
  for (const [, content] of serviceCards) {
    assert.equal((content.match(/<a\b/g) ?? []).length, 1, `${route}: um link por card`);
    assert.equal((content.match(/<\/a>/g) ?? []).length, 1, `${route}: nenhum link aninhado`);
    assert.match(content, /^\s*<a class="card service-card" href="[^"]+" aria-label="Conhecer [^"]+">[\s\S]*<\/a>\s*$/, `${route}: link envolve todo o card`);
    assert.ok(services.some(({ href }) => content.includes(`href="${href}"`)), `${route}: destino de serviço`);
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, route);
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(!titles.has(title), `Título específico: ${route}`);
  assert.ok(!descriptions.has(description), `Descrição específica: ${route}`);
  titles.add(title);
  descriptions.add(description);
  assert.equal((html.match(/<mvm-whatsapp-contact\b/g) ?? []).length, 1, route);
  const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
  for (const href of expectedNavigation) assert.ok(header.includes(`href="${href}"`), route);
  const submenu = header.match(/<ul id="service-submenu"[\s\S]*?<\/ul>/)[0];
  assert.match(submenu, /hidden/);
  assert.deepEqual([...submenu.matchAll(/href="([^"]+)"/g)].map(([, href]) => href), [...services.map(({ href }) => href), '/servicos/']);
  const servicesLink = header.match(/<a class="nav-link" href="\/servicos\/"([^>]*)>/)[1];
  if (route === '/servicos/') assert.match(servicesLink, /aria-current="page"/);
  else if (route.startsWith('/servicos/')) assert.match(servicesLink, /aria-current="location"/);
  else assert.ok(!servicesLink.includes('aria-current'));
  assert.equal(getNavigationCurrent('/', route), route === '/' ? 'page' : undefined);

  // Percorre o grafo de links internos, inclusive as âncoras de outra página.
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const destination = new URL(href, `https://mvm.invalid${route}`);
    if (destination.hostname !== 'mvm.invalid') continue;
    if (destination.pathname.startsWith('/_astro/')) {
      assert.ok(fs.existsSync(new URL(destination.pathname.slice(1), root)));
      continue;
    }
    assert.ok(pages.has(destination.pathname), `${route}: destino interno existente ${href}`);
    if (destination.hash) assert.ok(pages.get(destination.pathname).includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), href);
  }
  const externalLinks = [...html.matchAll(/<a\b([^>]*)href="(https:\/\/wa\.me\/[^"\s]+)"([^>]*)>/g)];
  for (const [, , link, attributes] of externalLinks) {
    const url = new URL(link);
    assert.equal(url.pathname, `/${contact.whatsappNumber}`);
    const message = url.searchParams.get('text');
    assert.ok(Object.values(contact.messages).includes(message));
    assert.equal(url.search, `?text=${encodeURIComponent(message)}`);
    assert.match(attributes, /target="_blank"/);
    assert.match(attributes, /rel="noopener noreferrer"/);
  }
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, `${route}: footer compartilhado`);
  assert.ok(footer.includes(`href="${getWhatsAppUrl().replaceAll('&', '&amp;')}"`) || footer.includes(`href="${getWhatsAppUrl()}"`));
  assert.ok(footer.includes('Fale pelo WhatsApp'));
  assert.ok(footer.includes(`href="${contact.instagram.url}"`));
  assert.ok(footer.includes(contact.instagram.handle));
  assert.ok(footer.includes(contact.email));
  if (getEmailUrl()) assert.ok(footer.includes(`href="${getEmailUrl()}"`));
  else assert.ok(!footer.includes('mailto:'));
  assert.equal(externalLinks.at(-1)?.[2], getWhatsAppUrl());
  if (route === '/' || route === '/sobre-nos/' || route === '/contato/') continue;
  assert.equal(externalLinks.length, route === '/servicos/' ? 3 : 4);
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  assert.ok(!/\bPGR\b|\bPCMSO\b|\bLTCAT\b|treinamentos?|certificaç|\b\d+\s*(?:dias|horas)|lorem ipsum/i.test(main));
  assert.ok(!/class="breadcrumbs"|Caminho da página/.test(main), route);
  assert.ok(main.includes('data-motion="card"'));
  const service = services.find(({ href }) => href === route);
  const expectedUrl = getWhatsAppUrl(service?.message ?? 'general');
  assert.equal(externalLinks[0][2], getWhatsAppUrl('general')); // Header.
  if (service) {
    assert.equal(externalLinks[1][2], getWhatsAppUrl(individualBanners[service.slug].message));
    assert.equal(externalLinks[2][2], expectedUrl);
  } else assert.equal(externalLinks[1][2], expectedUrl);
  if (service) {
    const opening = main.match(/<section class="banner-single"[\s\S]*?<\/section>/)[0];
    assert.ok(!opening.includes('data-motion'));
    assert.ok(!opening.includes('banner-navigation'));
    assert.ok(!opening.includes('mvm-banner-carousel'));
    assert.ok(opening.includes(individualBanners[service.slug].title));
    assert.ok(opening.includes(individualBanners[service.slug].description));
    assert.equal((opening.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((opening.match(/<img\b/g) ?? []).length, 1);
    for (const heading of ['O que é', 'Quando sua empresa pode precisar', 'Para quem é o atendimento', 'Como a MVM atende', 'Perguntas frequentes', 'Conheça também']) {
      assert.ok(main.includes(heading), `${route}: ${heading}`);
    }
    assert.equal((main.match(/class="card service-situation"/g) ?? []).length, 2);
    assert.equal((main.match(/class="faq-item"/g) ?? []).length, 3);
    assert.equal((main.match(/<figure class="service-visual/g) ?? []).length, service.secondaryVisual ? 1 : 0);
    for (const related of services.filter(({ slug }) => slug !== service.slug)) assert.ok(main.includes(`href="${related.href}"`));
  } else {
    const carousel = main.match(/<mvm-banner-carousel\b[\s\S]*?<\/mvm-banner-carousel>/)[0];
    assert.ok(main.indexOf('<h1') < main.indexOf('<mvm-banner-carousel'));
    assert.equal((carousel.match(/class="banner-slide(?: is-active)?"/g) ?? []).length, 3);
    assert.equal((carousel.match(/<h2\b/g) ?? []).length, 3);
    assert.equal((carousel.match(/<img\b/g) ?? []).length, 3);
    assert.match(carousel, /class="container banner-navigation" hidden/);
    for (const { title, description, cta, href } of serviceSlides) {
      assert.ok(carousel.includes(title));
      assert.ok(carousel.includes(description));
      assert.ok(carousel.includes(`href="${href}"`));
      assert.ok(carousel.includes(`<span>${cta}</span>`));
    }
    assert.equal((main.match(/class="card service-card"/g) ?? []).length, 3);
    for (const segment of ['Indústrias', 'Agronegócio', 'Construtoras']) assert.ok(main.includes(segment));
    assert.ok(main.includes('Não sabe qual solução sua empresa precisa?'));
  }
}

const general = pages.get('/servicos/');
const aboutPage = pages.get('/sobre-nos/');
const contactPage = pages.get('/contato/');
assert.ok(aboutPage.includes('Conhecimento técnico e cuidado próximo da sua empresa.'));
assert.ok(aboutPage.includes('Fundação da MVM') && aboutPage.includes('Expansão para a clínica'));
assert.ok(aboutPage.includes('data-history-timeline') && !aboutPage.includes('data-timeline-toggle'));
assert.ok(aboutPage.includes('Conheça a nossa estrutura'));
assert.equal((aboutPage.match(/class="gallery-item"/g) ?? []).length, 6);
assert.ok(aboutPage.includes('Fonte cartográfica: IBGE'));
assert.ok(contactPage.includes('Vamos conversar sobre a sua empresa?'));
assert.ok(contactPage.includes(officeAddress));
assert.ok(contactPage.includes(officeMapEmbedUrl.replaceAll('&', '&amp;')) || contactPage.includes(officeMapEmbedUrl));
assert.ok(contactPage.includes(officeDirectionsUrl.replaceAll('&', '&amp;')) || contactPage.includes(officeDirectionsUrl));
assert.ok(contactPage.includes(contact.instagram.url));
assert.equal((contactPage.match(/class="card contact-topic-card"/g) ?? []).length, 4);
for (const message of ['safety', 'occupational', 'onsite', 'general']) {
  assert.ok(contactPage.includes(getWhatsAppUrl(message).replaceAll('&', '&amp;')) || contactPage.includes(getWhatsAppUrl(message)));
}
assert.ok(contactPage.includes('<iframe class="office-map"'));
assert.ok(contactPage.includes(contact.email) && contactPage.includes(contact.hours));
assert.ok(!contactPage.includes(`href="mailto:${contact.email}"`));
assert.equal((contactPage.match(/class="instagram-previews"[\s\S]*?<a href="https:\/\/www\.instagram\.com\/mvmsegmed\//g) ?? []).length, 1);
const mapSource = fs.readFileSync(new URL('../src/assets/maps/ibge-ufs.svg', import.meta.url), 'utf8');
assert.equal((mapSource.match(/<path id="\d+"/g) ?? []).length, 27);
assert.ok(mapSource.includes('<path id="35"') && mapSource.includes('<path id="41"'));
const provisionalEmail = contact.email;
contact.email = 'oficial@mvm.com.br';
assert.equal(getEmailUrl(), 'mailto:oficial@mvm.com.br');
contact.email = provisionalEmail;
for (const [route, expectedSlides] of [['/', homeSlides], ['/servicos/', serviceSlides]]) {
  const html = pages.get(route);
  const carousel = html.match(/<mvm-banner-carousel\b[\s\S]*?<\/mvm-banner-carousel>/)?.[0];
  assert.ok(carousel, `${route}: carrossel compartilhado`);
  assert.equal((carousel.match(/class="banner-slide(?: is-active)?"/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/class="banner-image"/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/<h2\b/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/data-slide-to=/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/class="banner-slide[^>]+hidden/g) ?? []).length, expectedSlides.length - 1);
  assert.equal((carousel.match(/loading="eager"/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/sizes="\(max-width: 38rem\) 340vw, \(max-width: 52rem\) 190vw, 100vw"/g) ?? []).length, expectedSlides.length);
  assert.equal((carousel.match(/srcset=/g) ?? []).length, expectedSlides.length);
  const titles = [...carousel.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/g)].map(([, title]) => title);
  assert.deepEqual(titles, expectedSlides.map(({ title }) => title));
  expectedSlides.forEach(({ href, message, cta }, index) => {
    const destination = message ? getWhatsAppUrl(message) : href;
    assert.ok(carousel.includes(`href="${destination}"`), `${route}: destino ${index + 1}`);
    assert.ok(carousel.includes(`<span>${cta}</span>`), `${route}: CTA ${index + 1}`);
    assert.ok(carousel.includes(`data-slide-to="${index}"`), `${route}: seletor ${index + 1}`);
  });
  assert.ok(carousel.includes('data-previous') && carousel.includes('data-next'));
  assert.ok(!carousel.includes('data-pause'));
  assert.ok(!carousel.includes('Imagem ilustrativa'));
}
const carouselScript = [...general.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(([, body]) => body).find((body) => body.includes('mvm-banner-carousel'));
assert.ok(carouselScript);
class CarouselElement extends EventTarget {
  hidden = false;
  inert = false;
  dataset = {};
  attributes = new Map();
  classList = { toggle: (name, value) => { if (name === 'is-active') this.active = value; } };
  matches() { return false; }
  contains(target) { return this === target; }
  querySelector(selector) { return this.controls?.get(selector) ?? null; }
  querySelectorAll(selector) { return this.controls?.get(selector) ?? []; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
}
const documentForCarousel = new EventTarget();
documentForCarousel.activeElement = null;
documentForCarousel.hidden = false;
const windowForCarousel = new EventTarget();
const timers = new Map();
let nextTimer = 1;
windowForCarousel.setTimeout = (fn, ms) => { assert.equal(ms, 5000); const id = nextTimer++; timers.set(id, fn); return id; };
windowForCarousel.clearTimeout = (id) => timers.delete(id);
const motion = new EventTarget();
motion.matches = false;
windowForCarousel.matchMedia = () => motion;
let observer;
windowForCarousel.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; observer = this; }
  observe() {}
  disconnect() { this.disconnected = true; }
  emit(visible) { this.callback([{ isIntersecting: visible }]); }
};
const carouselRegistry = new Map();
vm.runInNewContext(carouselScript, {
  HTMLElement: CarouselElement, AbortController,
  document: documentForCarousel, window: windowForCarousel,
  IntersectionObserver: windowForCarousel.IntersectionObserver,
  customElements: { get: (name) => carouselRegistry.get(name), define: (name, value) => carouselRegistry.set(name, value) },
});
const Carousel = carouselRegistry.get('mvm-banner-carousel');
const carousel = new Carousel();
const slides = Array.from({ length: 3 }, () => new CarouselElement(carousel));
const controls = new CarouselElement(carousel);
controls.hidden = true;
const previous = new CarouselElement();
const next = new CarouselElement();
const indicators = Array.from({ length: 3 }, () => new CarouselElement(controls));
const status = new CarouselElement(controls);
slides.forEach((slide) => { slide.controls = new Map([['img', { complete: true, naturalWidth: 1774 }]]); });
carousel.controls = new Map([
  ['.banner-slide', slides], ['.banner-navigation', controls], ['[data-previous]', previous],
  ['[data-next]', next], ['[data-slide-to]', indicators], ['[data-current]', status],
]);
const clickCarousel = (element) => element.dispatchEvent(new Event('click'));
const touch = (type, x, y) => {
  const event = new Event(type);
  Object.defineProperty(event, 'changedTouches', { value: [{ clientX: x, clientY: y }] });
  carousel.dispatchEvent(event);
};
carousel.connectedCallback();
const activeSlides = () => slides.map((slide, index) => !slide.inert ? index : null).filter((index) => index !== null);
assert.deepEqual(activeSlides(), [0]);
assert.equal(controls.hidden, false);
assert.equal(slides.every((slide) => slide.hidden === false), true);
assert.equal(carousel.dataset.enhanced, 'true');
assert.equal(timers.size, 0); // Aguarda saber se o carrossel está visível.
observer.emit(true);
assert.equal(timers.size, 1);
const runTimer = () => { const [id, fn] = timers.entries().next().value; timers.delete(id); fn(); };
runTimer();
assert.deepEqual(activeSlides(), [1]);
assert.equal(timers.size, 1); // Loop com um único timer.
runTimer();
runTimer();
assert.deepEqual(activeSlides(), [0]);
carousel.dispatchEvent(new Event('mouseenter'));
assert.equal(timers.size, 0);
carousel.dispatchEvent(new Event('mouseleave'));
assert.equal(timers.size, 1);
carousel.dispatchEvent(new Event('focusin'));
assert.equal(timers.size, 0);
carousel.dispatchEvent(new Event('focusout'));
assert.equal(timers.size, 1);
documentForCarousel.hidden = true;
documentForCarousel.dispatchEvent(new Event('visibilitychange'));
assert.equal(timers.size, 0);
documentForCarousel.hidden = false;
documentForCarousel.dispatchEvent(new Event('visibilitychange'));
assert.equal(timers.size, 1);
observer.emit(false);
assert.equal(timers.size, 0);
observer.emit(true);
assert.equal(timers.size, 1);
motion.matches = true;
motion.dispatchEvent(new Event('change'));
assert.equal(timers.size, 0);
motion.matches = false;
motion.dispatchEvent(new Event('change'));
assert.equal(timers.size, 1);
clickCarousel(next);
assert.deepEqual(activeSlides(), [1]);
assert.equal(indicators[1].attributes.get('aria-current'), 'true');
assert.equal(slides[0].attributes.get('aria-hidden'), 'true');
assert.equal(status.textContent, '02');
assert.equal(timers.size, 0); // Primeira navegação manual encerra o autoplay.
clickCarousel(indicators[2]);
assert.deepEqual(activeSlides(), [2]);
clickCarousel(previous);
assert.deepEqual(activeSlides(), [1]);
touch('touchstart', 200, 100);
touch('touchend', 100, 110);
assert.deepEqual(activeSlides(), [2]);
touch('touchstart', 200, 100);
touch('touchend', 140, 200);
assert.deepEqual(activeSlides(), [2]); // Gesto vertical preserva a rolagem.
clickCarousel(indicators[0]);
assert.deepEqual(activeSlides(), [0]);
carousel.dispatchEvent(new Event('mouseenter'));
assert.equal(timers.size, 0);
clickCarousel(next);
assert.deepEqual(activeSlides(), [1]);
assert.equal(timers.size, 0);
carousel.dispatchEvent(new Event('mouseleave'));
assert.equal(timers.size, 0);
carousel.dispatchEvent(new Event('focusin'));
assert.equal(timers.size, 0);
carousel.dispatchEvent(new Event('focusout'));
assert.equal(timers.size, 0);
documentForCarousel.hidden = true;
documentForCarousel.dispatchEvent(new Event('visibilitychange'));
assert.equal(timers.size, 0);
documentForCarousel.hidden = false;
documentForCarousel.dispatchEvent(new Event('visibilitychange'));
assert.equal(timers.size, 0);
observer.emit(false);
assert.equal(timers.size, 0);
observer.emit(true);
assert.equal(timers.size, 0); // Pausa manual persiste após mudanças de visibilidade.
motion.matches = true;
motion.dispatchEvent(new Event('change'));
assert.equal(timers.size, 0);
motion.matches = false;
motion.dispatchEvent(new Event('change'));
assert.equal(timers.size, 0);
carousel.disconnectedCallback();
assert.equal(timers.size, 0);
assert.equal(observer.disconnected, true);
clickCarousel(next);
assert.deepEqual(activeSlides(), [1]);
motion.matches = true;
carousel.connectedCallback();
assert.deepEqual(activeSlides(), [0]);
observer.emit(true);
assert.equal(timers.size, 0); // Movimento reduzido não inicia autoplay.
motion.matches = false;
motion.dispatchEvent(new Event('change'));
assert.equal(timers.size, 1);
clickCarousel(previous);
assert.deepEqual(activeSlides(), [2]);
carousel.disconnectedCallback();
assert.equal(timers.size, 0);
const styles = fs.readFileSync(new URL('../src/styles/banner-carousel.css', import.meta.url), 'utf8');
assert.ok(styles.includes('(prefers-reduced-motion: reduce)'));
assert.ok(carouselScript.includes('5e3') || carouselScript.includes('5000'));

const home = pages.get('/');
const headerScript = [...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(([, body]) => body)
  .find((body) => body.includes('data-service-menu'));
assert.ok(headerScript);

function checkHeader(isMobile) {
  const document = new EventTarget();
  document.activeElement = null;
  document.documentElement = { style: { setProperty() {} } };
  class Element extends EventTarget {
    hidden = false;
    attributes = new Map();
    classList = { toggle() {} };
    constructor(parent = null, tagName = 'DIV') { super(); this.parent = parent; this.tagName = tagName; }
    querySelector(selector) { return this.controls?.get(selector) ?? null; }
    setAttribute(name, value) { this.attributes.set(name, value); }
    getAttribute(name) { return this.attributes.get(name); }
    contains(target) { return Boolean(target && (target === this || this.contains(target.parent))); }
    closest(selector) { return selector === 'a' && this.tagName === 'A' ? this : this.parent?.closest(selector); }
    focus() { document.activeElement = this; }
    getBoundingClientRect() { return { height: 81 }; }
  }
  const header = new Element();
  const menuToggle = new Element(header, 'BUTTON');
  const navigation = new Element(header, 'NAV');
  const serviceMenu = new Element(navigation, 'LI');
  const serviceToggle = new Element(serviceMenu, 'BUTTON');
  const serviceLink = new Element(serviceMenu, 'A');
  const submenu = new Element(serviceMenu, 'UL');
  const firstLink = new Element(submenu, 'A');
  const outside = new Element();
  const menuLabel = new Element(menuToggle);
  menuToggle.controls = new Map([['.menu-label', menuLabel]]);
  menuToggle.setAttribute('aria-expanded', 'false');
  submenu.hidden = true;
  serviceToggle.hidden = true;
  header.controls = new Map([['[data-service-menu]', serviceMenu], ['[data-service-toggle]', serviceToggle], ['#service-submenu', submenu]]);
  submenu.controls = new Map([['a', firstLink]]);
  document.querySelector = (selector) => new Map([['[data-header]', header], ['.menu-toggle', menuToggle], ['#main-navigation', navigation]]).get(selector);
  const mobile = new EventTarget();
  mobile.matches = isMobile;
  const hover = { matches: true };
  const window = new EventTarget();
  window.scrollY = 0;
  window.matchMedia = (query) => query.includes('hover') ? hover : mobile;
  vm.runInNewContext(headerScript, { window, document });
  const fire = (target, type, properties = {}) => {
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
    return event;
  };
  const expanded = () => serviceToggle.getAttribute('aria-expanded');
  assert.equal(submenu.hidden, true);
  assert.equal(serviceToggle.hidden, false);
  assert.equal(navigation.hidden, isMobile);
  assert.equal(menuToggle.hidden, !isMobile);
  if (isMobile) fire(menuToggle, 'click');
  fire(serviceMenu, 'mouseenter');
  assert.equal(submenu.hidden, isMobile); // Hover exclusivo do desktop.
  if (!isMobile) {
    fire(document, 'click', { target: firstLink });
    assert.equal(submenu.hidden, false); // Descendente mantém aberto.
    document.activeElement = firstLink;
    fire(serviceMenu, 'mouseleave');
    assert.equal(submenu.hidden, false); // Navegação por teclado continua acessível.
    fire(serviceMenu, 'focusout', { relatedTarget: outside });
    assert.equal(submenu.hidden, true);
  }
  fire(serviceToggle, 'click');
  assert.equal(expanded(), 'true');
  assert.equal(submenu.hidden, false);
  fire(document, 'keydown', { key: 'Escape' });
  assert.equal(submenu.hidden, true);
  assert.equal(expanded(), 'false');
  assert.equal(document.activeElement, serviceToggle);
  if (isMobile) assert.equal(navigation.hidden, false); // Escape fecha um nível.
  const down = fire(serviceToggle, 'keydown', { key: 'ArrowDown' });
  assert.equal(down.defaultPrevented, true);
  assert.equal(document.activeElement, firstLink);
  assert.equal(submenu.hidden, false);
  fire(document, 'click', { target: outside });
  assert.equal(submenu.hidden, true);
  if (isMobile) {
    fire(serviceToggle, 'click');
    fire(navigation, 'click', { target: serviceLink });
    assert.equal(navigation.hidden, true);
    assert.equal(submenu.hidden, true);
    fire(menuToggle, 'click');
    fire(document, 'keydown', { key: 'Escape' });
    assert.equal(navigation.hidden, true);
    assert.equal(document.activeElement, menuToggle);
  }
  mobile.matches = !isMobile;
  fire(mobile, 'change');
  assert.equal(menuToggle.hidden, isMobile);
  assert.equal(navigation.hidden, !isMobile);
  assert.equal(submenu.hidden, true);
}
checkHeader(false);
checkHeader(true);
console.log('OK: sete rotas, links internos, cards sem aninhamento, banner Sobre nós, quatro assuntos de contato, mapa IBGE e WhatsApp.');
console.log('OK em DOM simulado: autoplay em loop de 5s, pausa contextual, parada após interação manual, movimento reduzido, toque e limpeza.');
console.log('OK em DOM simulado: hover, clique, descendentes, foco, ArrowDown, Escape, menu mobile e troca de breakpoint.');
console.log('Este script não valida aparência, teclado nativo, hover físico ou responsividade.');
