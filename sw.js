// ============================================================
// SERVICE WORKER — Sistema de Novedades
// 
// Hace 3 cosas:
//   1. Cachea assets para que la app funcione offline (PWA)
//   2. Recibe push notifications (Web Push API)
//   3. Maneja clicks en notificaciones
// 
// El SW se actualiza solo cuando cambia la versión del CACHE_NAME.
// ============================================================

const CACHE_VERSION = 'v2';
const CACHE_NAME = `novedades-${CACHE_VERSION}`;
const BASE = '/novedades';

// Archivos esenciales para que la app funcione offline
const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/Logo para programa.png`,
  `${BASE}/Escudo 3d sin fondo.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE).catch(err => console.warn('Precache parcial:', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Limpiar caches viejos
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('novedades-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // NUNCA cachear:
  //  - Supabase API (data en tiempo real)
  //  - cualquier cosa que no sea GET
  if (req.method !== 'GET') return;
  if (url.hostname.includes('supabase.co')) return;
  // No interceptar el propio sw.js (deja que el browser lo maneje)
  if (url.pathname.endsWith('/sw.js')) return;

  // Navegación HTML: network-first con fallback al index cacheado
  if (req.mode === 'navigate' || (req.destination === 'document')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Guardar copia en cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(`${BASE}/index.html`).then(r => r || caches.match(`${BASE}/`)))
    );
    return;
  }

  // Resto (JS/CSS/imágenes): cache-first con revalidación en background
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
        }
        return response;
      }).catch(() => cached); // si offline, devuelve cached
      return cached || fetchPromise;
    })
  );
});

// ============================================================
// PUSH NOTIFICATIONS
// Recibe el push del servidor y muestra la notificación al usuario.
// Funciona AUNQUE la pestaña esté cerrada (es la magia del SW).
// ============================================================
self.addEventListener('push', (event) => {
  let data = { title: 'Sistema de Novedades', body: 'Tienes una nueva notificación', url: BASE + '/' };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: `${BASE}/Logo para programa.png`,
      badge: `${BASE}/Logo para programa.png`,
      tag: data.tag || 'novedades',
      renotify: false,
      requireInteraction: false,
      data: { url: data.url || BASE + '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || (BASE + '/');

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si ya hay una pestaña abierta, enfocarla
      for (const client of windowClients) {
        if (client.url.includes(BASE) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
          return;
        }
      }
      // Si no, abrir nueva
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

// ============================================================
// MESSAGE HANDLER — comunicación desde la app
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
