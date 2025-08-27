// add near top of js/app.js (after gsap/global checks)
const footer = document.querySelector('.site-footer');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setFooterYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
}
setFooterYear();

function showFooter(show, animate = true) {
  if (!footer) return;
  footer.setAttribute('aria-hidden', String(!show));

  // no animation for reduced-motion or when animate=false
  if (prefersReduced || !animate) {
    footer.classList.toggle('hidden', !show);
    return;
  }

  if (show) {
    footer.classList.remove('hidden');
    // animate in (uses gsap if loaded)
    if (window.gsap) {
      gsap.fromTo(footer, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    } else {
      footer.style.opacity = '1';
    }
  } else {
    if (window.gsap) {
      gsap.to(footer, {
        y: 12, opacity: 0, duration: 0.28, ease: 'power2.in',
        onComplete() { footer.classList.add('hidden'); footer.style.opacity = ''; footer.style.transform = ''; }
      });
    } else {
      footer.classList.add('hidden');
    }
  }
}

function updateFooterForRoute(path) {
  // show only on home. Adjust if you also want '/index.html' or '#/' support.
  const isHome = path === '#/';
  showFooter(isHome);
}
