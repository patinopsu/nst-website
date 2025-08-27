
const routes = {
  '#/': '/resources/pages/home.html',
  '#/about': '/resources/pages/about.html',
  '#/explore': '/resources/pages/explore.html',
  '#/news': '/resources/pages/news.html',
  '#/credit': '/resources/pages/credit.html'
};

const cache = new Map();
const app = document.getElementById('app');
let currentEl = null;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function log(...args){ console.log('[app]', ...args); }
function warn(...args){ console.warn('[app]', ...args); }
function error(...args){ console.error('[app]', ...args); }

async function fetchPage(url){
  try {
    if (cache.has(url)) return cache.get(url);
    log('fetching', url);
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const html = await res.text();
    cache.set(url, html);
    return html;
  } catch (err) {
    error('fetchPage error for', url, err);
    throw err;
  }
}

async function transitionTo(path, push = true) {
  const url = routes[path] || routes['#/'];
  app.setAttribute('aria-busy', 'true');
  try {
    const html = await fetchPage(url);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const newEl = wrapper.querySelector('.page') || wrapper.firstElementChild;
    if (!newEl) throw new Error(`No element .page found in ${url}`);
    if (prefersReduced) {
      app.innerHTML = '';
      app.appendChild(newEl);
      currentEl = app.querySelector('.page') || app.firstElementChild;
      if (currentEl) currentEl.focus();
    } else {
      if (currentEl) {
        gsap.to(currentEl, {
          opacity: 0,
          y: 20,
          duration: 0.33,
          ease: 'power2.inOut',
          onComplete() {
            app.innerHTML = '';
            app.appendChild(newEl);
            currentEl = app.querySelector('.page') || app.firstElementChild;
            gsap.from(currentEl, { opacity: 0, y: -20, duration: 0.45, ease: 'power2.out' });
            if (currentEl) currentEl.focus();
            updateFooterForRoute(path);
          }
        });
      } else {
        app.appendChild(newEl);
        currentEl = app.querySelector('.page') || app.firstElementChild;
        gsap.from(currentEl, { opacity: 0, y: -20, duration: 0.45, ease: 'power2.out' });
        if (currentEl) currentEl.focus();
      }
    }

    if (push) history.pushState({ path }, '', path);
  } catch (err) {
    app.innerHTML = `<p style="font-size: 30px;">เกิดข้อผิดพลาดในการเรียกดูหน้่านี้ โปรดลองอีกครั้งในภายหลัง</p>`;
  } finally {
    app.removeAttribute('aria-busy');
  }
}

// link handling
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  const href = a.getAttribute('href');
  // ignore external links and protocols
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  e.preventDefault();
  transitionTo(href, true).catch(() => {});
});

// back/forward
window.addEventListener('popstate', (e) => {
  const path = (e.state && e.state.path) || location.pathname;
  transitionTo(path, false).catch(() => {});
});

// initial load
window.addEventListener('DOMContentLoaded', () => {
  log('initial path', location.pathname);
  transitionTo(location.pathname, false).catch(err => {
    error('Initial transition failed:', err);
    warn('If your server is not configured to serve index.html for routes, try running a dev server or use hash routing.');
  });
});