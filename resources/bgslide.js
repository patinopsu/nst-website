// array of image URLs
const images = [
  '/resources/images/background1.webp',
  '/resources/images/background2.webp',
  '/resources/images/background3.webp',
  '/resources/images/background4.webp',
  '/resources/images/background5.webp'
];

const container = document.getElementById('bg-slider');

function preload(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(src);
    img.onerror = () => rej(src);
    img.src = src;
  });
}

Promise.all(images.map(preload))
  .then(startSlider)
  .catch(err => {
    console.warn('Some background images failed to load:', err);
    startSlider();
  });

function startSlider() {
  // create slide elements (insert in same order as images)
  images.forEach((url, i) => {
    const el = document.createElement('div');
    el.className = 'bg-slide';
    el.style.backgroundImage = `url('${url}')`;
    el.dataset.index = i;
    container.appendChild(el);
  });

  const slides = Array.from(document.querySelectorAll('.bg-slide'));

  if (!slides.length) return;

  const showDuration = 8;
  const fadeDuration = 2.0;
  const zoomAmount = 1.06;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

  slides.forEach((slide, i) => {
    tl.to(slide, {
      autoAlpha: 1,
      scale: zoomAmount,
      duration: fadeDuration,
      ease: 'power2.out'
    }, i * showDuration);

    tl.to(slide, {
      autoAlpha: 0,
      scale: zoomAmount + 0.02,
      duration: fadeDuration,
      ease: 'power2.in'
    }, i * showDuration + showDuration - fadeDuration);
  });
}