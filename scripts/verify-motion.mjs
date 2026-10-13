// Verifica GSAP e saída estática; não comprova layout ou suavidade visual.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { gsap } from 'gsap';

// Itens em atraso continuam visíveis até o início real do seu tween.
const targets = Array.from({ length: 3 }, () => ({ opacity: 1, y: 0 }));
const started = [];
const tween = gsap.fromTo(targets, { opacity: 0, y: 20 }, {
  opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
  immediateRender: false, paused: true,
  stagger: { each: 0.15, onStart: function () { started.push(this.targets()[0]); } },
});
assert.equal(tween.duration(), 1.2);
assert.ok(targets.every(({ opacity, y }) => opacity === 1 && y === 0));
tween.time(0.1);
assert.deepEqual(started, targets.slice(0, 1));
assert.ok(targets[0].opacity > 0 && targets[0].opacity < 1);
assert.equal(targets[1].opacity, 1);
assert.equal(targets[2].opacity, 1);
tween.time(0.2);
assert.deepEqual(started, targets.slice(0, 2));
assert.ok(targets[0].opacity > targets[1].opacity && targets[1].opacity > 0);
assert.equal(targets[2].opacity, 1);
tween.progress(1);
assert.ok(targets.every(({ opacity, y }) => opacity === 1 && y === 0));
tween.kill();
gsap.ticker.sleep();

const source = fs.readFileSync(new URL('../src/scripts/home.js', import.meta.url), 'utf8');
assert.ok(!/IntersectionObserver|setTimeout|setInterval|requestAnimationFrame|groupRows|offsetTop|offsetLeft|\.timeline\(/.test(source));
assert.equal((source.match(/ScrollTrigger\.batch\(/g) ?? []).length, 1);
assert.ok(source.includes("start: 'top bottom', end: 'top 85%'"));
assert.ok(!/once:\s*true/.test(source.match(/const boundaries[\s\S]*?\/\/ Só habilita/)[0]));
assert.ok(source.includes('onLeaveBack:'));
assert.ok(source.includes('interval: 0.1'));
assert.ok(source.includes('context.reveal(items, 0.15)'));
assert.ok(source.includes('immediateRender: false'));
assert.ok(source.includes('gsap.matchMedia()'));
assert.ok(!/scrub:|pin:|onEnterBack:|onUpdate:/.test(source));

// Exercita o módulo com superfícies simuladas apenas para verificar suas salvaguardas.
async function checkLifecycle({ reduced = false, fail = false } = {}) {
  const motionY = (element) => parseFloat(element.style.transform?.match(/translateY\(([^)]+)/)?.[1]) || 0;
  const item = (kind, top) => ({
    dataset: { motion: kind }, top, inert: false,
    style: { removeProperty(property) { delete this[property]; } },
    getBoundingClientRect() { return { top: this.top + motionY(this), bottom: this.top + motionY(this) + 160, width: 300, height: 160 }; },
    contains(target) { return this === target; },
  });
  const firstFold = item('reveal', 600);
  const title = item('reveal', 1100);
  const card = item('card', 1300);
  const otherCard = item('card', 1600);
  const elements = [firstFold, title, card, otherCard];
  const events = new Map();
  const triggers = [];
  const tweens = [];
  const killedTweens = [];
  let batch;
  let revert;
  let mediaContext;
  const mockGsap = {
    registerPlugin() { if (fail) throw new Error('Falha simulada'); },
    killTweensOf(element) { killedTweens.push(element); },
    getProperty(element) { return motionY(element); },
    set(target, vars) {
      for (const element of Array.isArray(target) ? target : [target]) {
        if (vars.clearProps) { delete element.style.opacity; delete element.style.transform; }
        else {
          if ('opacity' in vars) element.style.opacity = vars.opacity;
          if ('y' in vars) element.style.transform = 'translateY(' + vars.y + 'px)';
        }
      }
    },
    fromTo(targets, from, to) { tweens.push({ targets, from, to }); },
    matchMedia() {
      return {
        add(query, callback) {
          if (reduced) return;
          const context = { add(name, fn) { this[name] = fn; } };
          mediaContext = context;
          revert = callback(context);
        },
        revert() { revert?.(); },
      };
    },
  };
  const mockScrollTrigger = {
    create(vars) { const trigger = { vars, kill() { this.killed = true; } }; triggers.push(trigger); return trigger; },
    batch(targets, vars) { batch = { targets, vars }; return targets.map((trigger) => this.create({ ...vars, trigger })); },
    refresh() {},
  };
  const document = {
    activeElement: null,
    querySelectorAll(selector) { return selector === '[data-motion]' ? elements : []; },
    querySelector() { return { getBoundingClientRect: () => ({ bottom: 81 }) }; },
    addEventListener(name, callback) { events.set(name, callback); },
  };
  const window = {
    innerHeight: 900, location: { hash: '' },
    matchMedia: () => ({ matches: false }),
    addEventListener(name, callback) { events.set(name, callback); },
  };
  const executable = source
    .replace("import('gsap')", 'Promise.resolve({ gsap: mockGsap })')
    .replace("import('gsap/ScrollTrigger')", 'Promise.resolve({ ScrollTrigger: mockScrollTrigger })');
  await vm.runInNewContext(executable, {
    window, document, mockGsap, mockScrollTrigger, AbortController,
    console: { warn() {} },
  });
  assert.equal(firstFold.style.opacity, undefined);
  assert.ok(!triggers.some(({ vars }) => vars.trigger === firstFold));
  if (reduced || fail) {
    assert.equal(triggers.length, 0);
    assert.ok(elements.every((element) => element.style.opacity === undefined && !element.inert));
    return;
  }
  assert.equal(title.style.opacity, 0);
  assert.equal(card.style.opacity, 0);
  assert.equal(new Set(triggers.map(({ vars }) => vars.trigger)).size, triggers.length);
  assert.equal(batch.vars.start, 'top bottom');
  assert.equal(batch.vars.end, 'top 85%');
  assert.equal(batch.vars.interval, 0.1);
  assert.ok(triggers.every(({ vars }) => !vars.once && typeof vars.onRefreshInit === 'function'));
  card.top = 800;
  batch.vars.onLeave([card, otherCard]);
  assert.deepEqual(tweens[0].targets, [card]);
  assert.equal(otherCard.style.opacity, 0); // Callback atrasado não desarma um item abaixo da tela.
  events.get('focusin')({ target: title });
  assert.equal(title.style.opacity, undefined);
  assert.equal(title.inert, false);
  const titleTrigger = triggers.find(({ vars }) => vars.trigger === title);
  const complete = (tween) => {
    for (const element of tween.targets) {
      const child = { targets: () => [element], kill() { this.killed = true; } };
      tween.to.stagger.onStart.call(child);
      assert.equal(child.killed, undefined);
      assert.equal(element.inert, true);
      tween.to.stagger.onComplete.call(child);
      assert.equal(element.inert, false);
      assert.equal(element.style.opacity, undefined);
    }
  };
  complete(tweens[0]);

  // Duas descidas completas, com retorno ao topo e os mesmos atrasos entre elas.
  for (let pass = 0; pass < 2; pass++) {
    title.top = card.top = otherCard.top = 1000;
    titleTrigger.vars.onLeaveBack();
    batch.vars.onLeaveBack([card, otherCard]);
    assert.ok([title, card, otherCard].every((element) => element.style.opacity === 0 && element.inert));
    title.top = 700;
    const beforeTitle = tweens.length;
    titleTrigger.vars.onLeave();
    assert.equal(tweens.length, beforeTitle + 1);
    complete(tweens.at(-1));
    card.top = 720;
    otherCard.top = 760;
    batch.vars.onLeave([card, otherCard]);
    const cardsTween = tweens.at(-1);
    assert.deepEqual(cardsTween.targets, [card, otherCard]);
    assert.equal(cardsTween.from.opacity, 0);
    assert.equal(cardsTween.from.y, 20);
    assert.equal(cardsTween.to.duration, 0.9);
    assert.equal(cardsTween.to.ease, 'power2.out');
    assert.equal(cardsTween.to.stagger.each, 0.15);
    complete(cardsTween);
    const completedCount = tweens.length;
    batch.vars.onLeave([card, otherCard]);
    assert.equal(tweens.length, completedCount); // Não reinicia no mesmo cruzamento.
    title.top = card.top = otherCard.top = -200;
    assert.ok([title, card, otherCard].every((element) => element.style.opacity === undefined));
    card.top = 880;
    otherCard.top = 920;
    batch.vars.onLeaveBack([card, otherCard]);
    assert.equal(card.style.opacity, undefined); // Ainda visível na subida.
    assert.equal(otherCard.style.opacity, 0); // Reset individual, sem agrupar a linha.
    assert.ok(!triggers.some(({ killed }) => killed));
  }

  // Foco preserva conteúdo e impede inert/reset, mesmo fora da tela.
  title.top = 920;
  document.activeElement = title;
  titleTrigger.vars.onLeaveBack();
  assert.equal(title.style.opacity, undefined);
  assert.equal(title.inert, false);
  document.activeElement = null;
  titleTrigger.vars.onLeaveBack();
  assert.equal(title.style.opacity, 0);
  mediaContext.reset([firstFold]);
  assert.equal(firstFold.style.opacity, undefined);

  // A posição animada a 905px não deve resetar um item cujo layout está a 885px.
  card.top = 885;
  card.style.transform = 'translateY(20px)';
  card.style.opacity = 0.5;
  batch.vars.onLeaveBack([card]);
  assert.equal(card.style.opacity, 0.5);

  // Um batch atrasado após voltar ao topo mantém o estado pronto para reentrada.
  card.top = 1000;
  batch.vars.onLeaveBack([card]);
  const beforeStaleBatch = tweens.length;
  batch.vars.onLeave([card]);
  assert.equal(tweens.length, beforeStaleBatch);
  assert.equal(card.style.opacity, 0);
  assert.ok(killedTweens.includes(card));
  card.top = 700;
  batch.vars.onLeave([card]);
  const interrupted = tweens.at(-1);
  card.top = 1000;
  const child = { targets: () => [card], kill() { this.killed = true; } };
  interrupted.to.stagger.onStart.call(child);
  assert.equal(child.killed, true);
  assert.equal(card.style.opacity, 0);
  card.top = 700;
  batch.vars.onLeave([card]);
  complete(tweens.at(-1));
  window.__mvmMotionCleanup();
  assert.ok(triggers.every(({ killed }) => killed));
  assert.ok(elements.every((element) => element.style.opacity === undefined && !element.inert));
}
await checkLifecycle();
await checkLifecycle({ reduced: true });
await checkLifecycle({ fail: true });

const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.equal((html.match(/data-motion="card"/g) ?? []).length, 10);
assert.ok(!/data-motion-group|data-motion="hero/.test(html));
const hero = html.match(/<section id="home"[\s\S]*?<\/section>/)[0];
assert.ok(!/data-motion|opacity:|transform:/.test(hero));
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.equal((html.match(/<section\b/g) ?? []).length, 7);
assert.equal((html.match(/<img\b/g) ?? []).length, 6);
const css = fs.readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.ok(!/opacity:\s*0|visibility:\s*hidden|overflow(?:-x)?:\s*hidden/.test(css));
assert.ok(!/transform/.test(css.match(/\.card \{([^}]+)\}/)[1]));
assert.ok(html.includes('<mvm-banner-carousel'));
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(id));
console.log('OK: sequência GSAP, duas descidas em DOM simulado, reset fora da viewport, batch atrasado, foco, redução de movimento, falha, limpeza e HTML.');
console.log('Sem navegador: estes testes não validam responsividade nem suavidade visual.');
