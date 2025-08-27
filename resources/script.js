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
// script.js
(() => {
  const containerSelector = '.container header'; // adjust to your DOM
  const container = document.querySelector(containerSelector) || document;

  // defensive: warn if the expected container is missing
  if (!document.querySelector(containerSelector)) {
    console.warn(`Selector "${containerSelector}" not found — using document for delegation`);
  }

  // pages you expect (optional)
  const pages = ['home','about','explore','news','credits'];

  // render function: replace with your own behavior
  function render(page) {
    console.log('rendering page:', page);
    // example: use hash navigation so hashchange handler can also work
    if (location.hash.replace('#','') !== page) {
      location.hash = page;
    } else {
      // if hash already same, call internal rendering logic if needed
      // your existing render code should go here
      // e.g. loadTemplate(page) or switch sections
    }
  }

  // handle clicks via delegation
  container.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return; // not a click on or inside an <a>
    // ensure the link is inside the delegated container
    if (!container.contains(a)) return;

    console.log('Nav link clicked:', a, 'href=', a.getAttribute('href'));

    // normalize page name:
    const dataPage = a.getAttribute('data-page');
    const href = a.getAttribute('href') || '';
    const pageFromHref = href.startsWith('#') ? href.slice(1) : '';
    const page = dataPage || pageFromHref || a.id || '';

    if (!page) {
      // if you want normal link behavior, allow default; otherwise preventDefault
      console.warn('Could not determine page from link — leaving default behavior');
      return;
    }

    e.preventDefault(); // we handle navigation
    if (pages.length && !pages.includes(page)) {
      console.warn('Page not in known list:', page);
    }
    render(page);

    // update active classes (example)
    const navLinks = container.querySelectorAll('a');
    navLinks.forEach(x => x.classList.toggle('active', x === a));
  });

  // optional: react to hash changes (back/forward/bookmark)
  window.addEventListener('hashchange', () => {
    const page = location.hash.replace('#','') || 'home';
    console.log('hashchange ->', page);
    // call your render function to actually swap content
    // render(page); // uncomment if you want hashchange to trigger render
  });

  // quick startup debug
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, nav link count:',
      (container.querySelectorAll ? container.querySelectorAll('a').length : 'n/a'));
  });
})();
