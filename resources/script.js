// Background Slideshow
const images = ['/resources/images/background1.webp','/resources/images/background2.webp','/resources/images/background3.webp'];  
let i = 0;
const a = document.getElementById('bg1');
const b = document.getElementById('bg2');
let topLayer = a;
let bottomLayer = b;

images.forEach(src => { const im = new Image(); im.src = src; });

function swap() {
  bottomLayer.style.backgroundImage = `url('${images[i]}')`;
  bottomLayer.classList.add('visible');
  topLayer.classList.remove('visible');

  [topLayer, bottomLayer] = [bottomLayer, topLayer];
  i = (i + 1) % images.length;
}

topLayer.style.backgroundImage = `url('${images[0]}')`;
topLayer.classList.add('visible');
i = 1;
setInterval(swap, 8000);

// Web Page Selector
(() => {
  const containerSelector = '.container header';
  const container = document.querySelector(containerSelector) || document;

  if (!document.querySelector(containerSelector)) {
    console.warn(`Selector "${containerSelector}" not found — using document for delegation`);
  }

  const pages = ['home','about','explore','news','credits'];

  function render(page) {
    console.log('rendering page:', page);
    if (location.hash.replace('#','') !== page) {
      location.hash = page;
    } else {
    }
  }

  container.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (!container.contains(a)) return;

    console.log('Nav link clicked:', a, 'href=', a.getAttribute('href'));

    const dataPage = a.getAttribute('data-page');
    const href = a.getAttribute('href') || '';
    const pageFromHref = href.startsWith('#') ? href.slice(1) : '';
    const page = dataPage || pageFromHref || a.id || '';

    if (!page) {
      console.warn('Could not determine page from link — leaving default behavior');
      return;
    }

    e.preventDefault();
    if (pages.length && !pages.includes(page)) {
      console.warn('Page not in known list:', page);
    }
    render(page);

    const navLinks = container.querySelectorAll('a');
    navLinks.forEach(x => x.classList.toggle('active', x === a));
  });

  window.addEventListener('hashchange', () => {
    const page = location.hash.replace('#','') || 'home';
    console.log('hashchange ->', page);
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, nav link count:',
      (container.querySelectorAll ? container.querySelectorAll('a').length : 'n/a'));
  });
})();
