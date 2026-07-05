const CACHE_NAME='ty-kalyanam-v7-clean-20260705';
const ASSETS=['./','./index.html','./css/style.css?v=7.0','./js/app.js?v=7.0','./manifest.json','./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/images/temple.jpg','./assets/images/ty-logo-gold.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS).catch(()=>{})))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{if(event.request.destination==='video'||event.request.destination==='audio')return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)))});
