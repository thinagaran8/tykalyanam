const CACHE_NAME = 'ty-kalyanam-v3-20260705';
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=3.0',
  './js/app.js?v=3.0',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.destination === 'video') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
