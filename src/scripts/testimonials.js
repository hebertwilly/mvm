const testimonialSection = document.querySelector('.testimonials-section');

if (testimonialSection) {
  let controller;

  function initialize() {
    controller?.abort();
    controller = new AbortController();

    testimonialSection.querySelector('[data-testimonial-start]')?.addEventListener('click', () => {
      const firstVideo = testimonialSection.querySelector('#testimonial-video-1');
      firstVideo?.play().catch(() => {
        testimonialSection.querySelector('#testimonial-01 [data-testimonial-play]')?.focus();
      });
    }, { signal: controller.signal });

    testimonialSection.querySelectorAll('.testimonial-video').forEach((frame) => {
      const video = frame.querySelector('video');
      const playButton = frame.querySelector('[data-testimonial-play]');
      if (!video || !playButton) return;

      playButton.hidden = video.currentTime > 0 && !video.ended;
      playButton.addEventListener('click', () => {
        video.play().catch(() => {
          playButton.hidden = false;
        });
      }, { signal: controller.signal });
      video.addEventListener('playing', () => {
        playButton.hidden = true;
      }, { signal: controller.signal });
      video.addEventListener('ended', () => {
        playButton.hidden = false;
      }, { signal: controller.signal });
    });
  }

  initialize();
  window.addEventListener('pagehide', () => controller?.abort());
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) initialize();
  });
}
