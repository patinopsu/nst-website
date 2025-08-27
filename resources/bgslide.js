// array of image URLs
const images = [
  '/resources/images/background1.webp',
  '/resources/images/background2.webp',
  '/resources/images/background3.webp',
  '/resources/images/background4.webp',
  '/resources/images/background5.webp'
];

// build slides and preload images
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
    startSlider(); // still start with what we have
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

  // GSAP timeline: adjust timing values below to taste
  const showDuration = 8;     // how long a slide stays visible (including fade time)
  const fadeDuration = 2.0;   // fade in/out length
  const zoomAmount = 1.06;    // final scale on visible

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

  slides.forEach((slide, i) => {
    // animate-in
    tl.to(slide, {
      autoAlpha: 1,            // opacity + visibility
      scale: zoomAmount,
      duration: fadeDuration,
      ease: 'power2.out'
    }, i * showDuration);

    // animate-out (start so there's a crossfade)
    tl.to(slide, {
      autoAlpha: 0,
      scale: zoomAmount + 0.02,
      duration: fadeDuration,
      ease: 'power2.in'
    }, i * showDuration + showDuration - fadeDuration);
  });

  // optional: pause on hover
  container.addEventListener('mouseenter', () => tl.pause());
  container.addEventListener('mouseleave', () => tl.resume());
}