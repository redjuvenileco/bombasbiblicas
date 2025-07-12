// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
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

// Precarga assets
window.addEventListener('DOMContentLoaded', async () => {
  const assets = [
    'game.html',
    'css/style.css',
    'js/game.js',
    'sounds/tick.mp3',
    'sounds/boom.mp3',
    'sounds/success.mp3',
    'sounds/error.mp3'
  ];
  for (const url of assets) {
    try {
      const resp = await fetch(url, { cache: 'reload' });
      await resp.blob();
    } catch {}
  }
});

// Selección de modo
document.getElementById('mode-defuser').onclick = () => {
  sessionStorage.setItem('mode', 'defuser');
  location.href = 'game.html';
};
document.getElementById('mode-expert').onclick = () => {
  sessionStorage.setItem('mode', 'expert');
  location.href = 'game.html';
};
