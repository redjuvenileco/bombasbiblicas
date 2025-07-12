// Registra Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
// Selección de modo
document.getElementById('mode-defuser').onclick = () => {
  sessionStorage.setItem('mode','defuser');
  location.href = 'game.html';
};
document.getElementById('mode-expert').onclick = () => {
  sessionStorage.setItem('mode','expert');
  location.href = 'game.html';
};
