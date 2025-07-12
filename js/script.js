// Registrar Service Worker con scope raíz
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

// Evento beforeinstallprompt para PWA
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') installBtn.style.display = 'none';
  deferredPrompt = null;
});

// Modo de juego
document.getElementById('mode-defuser').onclick = () => {
  sessionStorage.setItem('mode', 'defuser');
  location.href = 'game.html';
};
document.getElementById('mode-expert').onclick = () => {
  sessionStorage.setItem('mode', 'expert');
  location.href = 'game.html';
};

// Precarga manual adicional: fuerza la descarga de los assets
window.addEventListener('DOMContentLoaded', async () => {
  const assets = [
    '/game.html',
    '/css/style.css',
    '/js/game.js',
    '/sounds/tick.mp3',
    '/sounds/boom.mp3',
    '/sounds/success.mp3',
    '/sounds/error.mp3'
  ];
  for (const url of assets) {
    try {
      const resp = await fetch(url, { cache: 'reload' });
      // opcional: leer el blob para forzar la descarga
      await resp.blob();
    } catch (e) {
      console.warn('No se pudo precargar', url, e);
    }
  }
});
