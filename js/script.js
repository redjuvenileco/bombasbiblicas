// Registrar Service Worker con scope raíz
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
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
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});

// Selección de modo de juego
document.getElementById('mode-defuser').onclick = () => {
  sessionStorage.setItem('mode', 'defuser');
  location.href = 'game.html';
};
document.getElementById('mode-expert').onclick = () => {
  sessionStorage.setItem('mode', 'expert');
  location.href = 'game.html';
};
