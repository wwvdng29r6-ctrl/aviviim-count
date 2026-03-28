const CACHE_NAME = 'prison-sw-v3';
const STATIC_CACHE = 'prison-static-v3';
const DYNAMIC_CACHE = 'prison-dynamic-v3';

const STATIC_ASSETS = [
  './',
  './test.html',
  './viewer.html',
  './kiosk.html',
  './demo.html'
];

const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install: cache all static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => {
      return caches.open(DYNAMIC_CACHE).then(cache => {
        const promises = EXTERNAL_ASSETS.map(url =>
          cache.add(url).catch(() => {})
        );
        return Promise.all(promises);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip Firebase and non-GET requests
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com/identitytoolkit') ||
      url.hostname.includes('firebasedatabase.app')) return;

  // HTML pages: network first, fallback to cache
  if (e.request.headers.get('accept')?.includes('text/html') ||
      url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Google Fonts CSS/woff2: cache first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  // CDN assets: cache first
  if (url.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Default: network with cache fallback
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(DYNAMIC_CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
