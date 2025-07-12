// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// Captura el evento beforeinstallprompt
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('App instalada');
    installBtn.style.display = 'none';
  }
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
