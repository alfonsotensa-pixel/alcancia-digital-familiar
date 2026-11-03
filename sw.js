/**
 * SmartPiggy Cloud - Service Worker para Instalación PWA y Soporte Offline-First
 */

const CACHE_NAME = 'smartpiggy-pwa-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/smartpiggy-bundle.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // No interceptar llamadas a Supabase o API en tiempo real
  const url = new URL(req.url);
  if (url.pathname.includes('/api/cloud/') || url.hostname.includes('supabase.co') || url.hostname.includes('firebaseio.com')) {
    return;
  }

  // Estrategia Network-First con respaldo en Caché Offline
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && url.origin === self.location.origin) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
