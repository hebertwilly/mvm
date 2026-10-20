const component = document.querySelector('[data-steps]');
const tabs = [...(component?.querySelectorAll('[role="tab"]') ?? [])];
const panel = component?.querySelector('[data-step-panel]');
const heading = panel?.querySelector('[data-step-heading]');
const description = panel?.querySelector('[data-step-text]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let transitionTimer;

function selectStep(index, focus = false) {
  const tab = tabs[index];
  if (!tab || !panel) return;
  tabs.forEach((item, itemIndex) => {
    item.setAttribute('aria-selected', String(itemIndex === index));
    item.tabIndex = itemIndex === index ? 0 : -1;
  });
  if (focus) tab.focus({ preventScroll: true });
  const strip = tab.closest('.steps-scroll');
  const left = tab.offsetLeft;
  const right = left + tab.offsetWidth;
  if (left < strip.scrollLeft) strip.scrollTo({ left, behavior: 'instant' });
  else if (right > strip.scrollLeft + strip.clientWidth) {
    strip.scrollTo({ left: right - strip.clientWidth, behavior: 'instant' });
  }
  clearTimeout(transitionTimer);
  const update = () => {
    heading.textContent = `${String(index + 1).padStart(2, '0')} — ${tab.querySelector('.step-title').textContent}`;
    description.textContent = tab.dataset.description;
    panel.setAttribute('aria-labelledby', tab.id);
    panel.classList.remove('is-changing');
  };
  if (reduceMotion.matches) update();
  else {
    panel.classList.add('is-changing');
    transitionTimer = window.setTimeout(update, 200);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStep(index));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectStep(next, true);
  });
});

const gallery = document.querySelector('[data-about-gallery]');
const slides = [...(gallery?.querySelectorAll('.about-slide') ?? [])];
let galleryIndex = 0;
let galleryTimer;
let galleryVisible = false;
const galleryObserver = gallery && slides.length > 1 ? new IntersectionObserver(([entry]) => {
  galleryVisible = entry.isIntersecting;
  syncGallery();
}, { threshold: 0.1 }) : null;

function syncGallery() {
  clearInterval(galleryTimer);
  if (!galleryVisible || document.hidden || reduceMotion.matches || slides.length < 2) return;
  galleryTimer = window.setInterval(() => {
    const nextIndex = (galleryIndex + 1) % slides.length;
    if (!slides[nextIndex].complete || !slides[nextIndex].naturalWidth) return;
    slides[galleryIndex].classList.remove('is-active');
    slides[galleryIndex].setAttribute('aria-hidden', 'true');
    galleryIndex = nextIndex;
    slides[galleryIndex].classList.add('is-active');
    slides[galleryIndex].setAttribute('aria-hidden', 'false');
  }, 1000);
}

galleryObserver?.observe(gallery);
document.addEventListener('visibilitychange', syncGallery);
reduceMotion.addEventListener('change', syncGallery);
window.addEventListener('pagehide', () => {
  clearTimeout(transitionTimer);
  clearInterval(galleryTimer);
  galleryObserver?.disconnect();
  document.removeEventListener('visibilitychange', syncGallery);
  reduceMotion.removeEventListener('change', syncGallery);
}, { once: true });
