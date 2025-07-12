const CACHE = 'bombas-bib-v3';
const ASSETS = [
  '/', '/index.html', '/game.html',
  '/css/style.css', '/js/script.js', '/js/game.js',
  '/manifest.json',
  '/sounds/tick.mp3', '/sounds/boom.mp3', '/sounds/success.mp3', '/sounds/error.mp3',
  '/icons/icon-192.png', '/icons/icon-512.png', '/README.pdf'
];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
);
self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
