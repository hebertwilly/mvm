// O HTML permanece visível. Só prepara elementos abaixo da dobra após inicializar.
async function initialize() {
  window.__mvmMotionCleanup?.();
  const elements = [...document.querySelectorAll('[data-motion]')];
  const originalInert = new Map(elements.map((element) => [element, element.inert]));
  // A primeira dobra e o conteúdo acima de um scroll restaurado ficam estáticos.
  const staticElements = new Set(elements.filter((element) => element.getBoundingClientRect().top < window.innerHeight));
  const revealed = new Set(staticElements);
  let disposed = false;
  let media;
  let stop = () => {};
  const restore = (element) => {
    ['opacity', 'transform'].forEach((property) => element.style.removeProperty(property));
    element.inert = originalInert.get(element);
  };
  const cleanup = () => {
    disposed = true;
    try { media?.revert(); } catch { /* Restauração direta abaixo. */ }
    try { stop(); } catch { /* Restauração direta abaixo. */ }
    elements.forEach(restore);
  };
  window.__mvmMotionCleanup = cleanup;

  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
    if (disposed) return;
    gsap.registerPlugin(ScrollTrigger);
    const show = (element) => {
      revealed.add(element);
      gsap.killTweensOf(element);
      gsap.set(element, { clearProps: 'opacity,transform' });
      restore(element);
    };
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const headerBottom = document.querySelector('[data-header]')?.getBoundingClientRect().bottom ?? 0;
      return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > headerBottom;
    };
    // Mede a posição de layout sem os 20px da própria animação.
    const belowViewport = (element) => element.getBoundingClientRect().top
      - (parseFloat(gsap.getProperty(element, 'y')) || 0) >= window.innerHeight;
    const safe = (callback) => function (...args) {
      if (disposed) return;
      try { return callback.apply(this, args); } catch (error) {
        cleanup();
        console.warn('As animações foram desativadas; o conteúdo permanece visível.', error);
      }
    };

    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', (context) => {
      const listeners = new AbortController();
      const triggers = [];
      let ready = false;
      stop = () => {
        ready = false;
        listeners.abort();
        triggers.forEach((trigger) => trigger.kill());
        elements.forEach(show);
      };
      context.add('reset', safe((items) => {
        if (!ready) return;
        items.forEach((element) => {
          // O callback de batch pode chegar atrasado. Nunca reseta conteúdo visível
          // nem oculta um controle que ainda contém o foco.
          if (staticElements.has(element) || !belowViewport(element)
            || element.contains(document.activeElement)) return;
          gsap.killTweensOf(element);
          revealed.delete(element);
          gsap.set(element, { opacity: 0, y: 20 });
          element.inert = true;
        });
      }));
      context.add('reveal', safe((items, stagger = 0) => {
        if (!ready) return;
        const targets = items.filter((element) => !revealed.has(element));
        // O batch pode chegar após uma rolagem rápida: só anima o que segue visível.
        targets.filter((element) => !visible(element) || element.contains(document.activeElement)).forEach((element) => {
          if (belowViewport(element) && !element.contains(document.activeElement)) context.reset([element]);
          else show(element);
        });
        const entering = targets.filter((element) => visible(element) && !revealed.has(element));
        entering.forEach((element) => revealed.add(element));
        if (!entering.length) return;
        gsap.fromTo(entering, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', immediateRender: false,
          stagger: {
            each: stagger,
            onStart: safe(function () {
              const element = this.targets()[0];
              // Não oculta itens que saíram da tela durante o intervalo do stagger.
              if (!visible(element) || element.contains(document.activeElement)) {
                this.kill();
                if (belowViewport(element) && !element.contains(document.activeElement)) context.reset([element]);
                else show(element);
                return;
              }
              element.inert = true;
            }),
            onComplete: safe(function () { restore(this.targets()[0]); }),
          },
        });
      }));

      const showAnchor = safe(() => {
        if (!window.location.hash) return;
        const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        elements.filter((element) => destination?.contains(element)).forEach(show);
      });
      document.addEventListener('focusin', safe((event) => {
        elements.filter((element) => element.contains(event.target)).forEach(show);
      }), { signal: listeners.signal });
      window.addEventListener('hashchange', showAnchor, { signal: listeners.signal });
      window.addEventListener('pagehide', cleanup, { once: true, signal: listeners.signal });
      showAnchor();

      const pending = elements.filter((element) => !staticElements.has(element));
      // Um único trigger por elemento: entrada a 85% na descida e reset a 100%
      // na subida. Callbacks equivalentes à repetição, compatíveis com batch.
      const boundaries = {
        start: 'top bottom', end: 'top 85%',
        // O ScrollTrigger reverte este set após medir, preservando o tween atual.
        onRefreshInit: (trigger) => gsap.set(trigger.trigger, { y: 0 }),
      };
      pending.filter((element) => element.dataset.motion === 'reveal').forEach((element) => {
        triggers.push(ScrollTrigger.create({
          ...boundaries, trigger: element,
          onLeave: () => context.reveal([element]),
          onLeaveBack: () => context.reset([element]),
        }));
      });
      triggers.push(...ScrollTrigger.batch(pending.filter((element) => element.dataset.motion === 'card'), {
        ...boundaries, interval: 0.1,
        batchMax: () => window.matchMedia('(max-width: 38rem)').matches ? 1 : 4,
        onLeave: (items) => context.reveal(items, 0.15),
        onLeaveBack: (items) => context.reset(items),
      }));
      // Só habilita o fade após criar todos os triggers com sucesso.
      // Se o layout mudou durante o import, preserva o que já está na primeira dobra.
      pending.filter((element) => element.getBoundingClientRect().top < window.innerHeight).forEach(show);
      ready = true;
      context.reset(pending);

      const refresh = safe(() => { if (ready) ScrollTrigger.refresh(); });
      document.fonts?.ready.then(refresh).catch(() => {});
      document.querySelectorAll('img').forEach((image) => {
        if (image.complete) return;
        image.addEventListener('load', refresh, { once: true, signal: listeners.signal });
        image.addEventListener('error', refresh, { once: true, signal: listeners.signal });
      });
      return stop;
    });
  } catch (error) {
    cleanup();
    console.warn('Não foi possível iniciar as animações; o conteúdo permanece visível.', error);
  }
}

if (typeof window !== 'undefined') initialize();
