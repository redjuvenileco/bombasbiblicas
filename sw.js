const CACHE = 'bombas-bib-cache-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/game.html',
  '/css/style.css',
  '/js/script.js',
  '/js/game.js',
  '/manifest.json',
  '/sounds/tick.mp3',
  '/sounds/boom.mp3',
  '/sounds/success.mp3',
  '/sounds/error.mp3',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
