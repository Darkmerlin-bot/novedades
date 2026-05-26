const CACHE = 'novedades-v2';
const PRECACHE = ['/novedades/', '/novedades/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // No interceptar Supabase ni Open-Meteo (siempre fresh)
  if (url.host.includes('supabase') || url.host.includes('open-meteo')) return;
  if (req.method !== 'GET') return;

  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    // HTML: network-first
    event.respondWith(
      fetch(req).then(r => {
        if (r && r.ok) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return r;
      }).catch(() => caches.match(req))
    );
  } else {
    // Assets: cache-first
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(r => {
          if (r && r.ok) {
            const clone = r.clone();
            caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
          }
          return r;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
