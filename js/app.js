const CONFIG = window.TYK || {};

const splash = document.getElementById('splash');
const enterBtn = document.getElementById('enterBtn');

const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let musicOn = false;

function closeSplash() {
  if (splash) splash.classList.add('hide');
}

async function playMusicFadeIn() {
  if (!bgMusic || !musicBtn) return;

  bgMusic.volume = 0;

  try {
    await bgMusic.play();
    musicOn = true;
    musicBtn.textContent = '♫';

    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      bgMusic.volume = Math.min(vol, 0.35);
      if (vol >= 0.35) clearInterval(fade);
    }, 120);
  } catch (e) {}
}

if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    closeSplash();
    playMusicFadeIn();
  });
}

setTimeout(closeSplash, 4200);

const pages = document.querySelectorAll('.page');
const tabs = document.querySelectorAll('.bottom-nav button');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    pages.forEach(p => p.classList.toggle('active', p.id === target));
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

const weddingDate = new Date(CONFIG.weddingDate || '2026-08-23T19:05:00+08:00').getTime();

function updateCountdown() {
  const distance = weddingDate - Date.now();
  const d = document.getElementById('days');
  const h = document.getElementById('hours');
  const m = document.getElementById('minutes');
  const s = document.getElementById('seconds');

  if (!d || !h || !m || !s) return;

  if (distance <= 0) {
    d.textContent = '0';
    h.textContent = '00';
    m.textContent = '00';
    s.textContent = '00';
    return;
  }

  d.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  h.textContent = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  m.textContent = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, '0');
  s.textContent = String(Math.floor((distance / 1000) % 60)).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}

if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', async () => {
    try {
      if (!musicOn) {
        await bgMusic.play();
        musicOn = true;
        musicBtn.textContent = '♫';
      } else {
        bgMusic.pause();
        musicOn = false;
        musicBtn.textContent = '♪';
      }
    } catch (e) {
      alert('Upload assets/audio/music.mp3 to enable background music.');
    }
  });
}

const navModal = document.getElementById('navModal');
const navBtn = document.getElementById('navBtn');
const closeNav = document.getElementById('closeNav');

if (navBtn) navBtn.addEventListener('click', () => navModal && navModal.classList.add('show'));
if (closeNav) closeNav.addEventListener('click', () => navModal && navModal.classList.remove('show'));
if (navModal) {
  navModal.addEventListener('click', e => {
    if (e.target === navModal) navModal.classList.remove('show');
  });
}

document.querySelectorAll('[data-google]').forEach(btn =>
  btn.addEventListener('click', () => {
    window.location.href = CONFIG.googleMapsUrl || 'https://maps.app.goo.gl/2QyUj3udpuiFAStJ6';
  })
);

document.querySelectorAll('[data-waze]').forEach(btn =>
  btn.addEventListener('click', () => {
    window.location.href = CONFIG.wazeUrl || 'https://waze.com/ul/hw284r2bty';
  })
);

const videoBtn = document.getElementById('videoBtn');
const videoLayer = document.getElementById('videoLayer');
const weddingVideo = document.getElementById('weddingVideo');
const closeVideo = document.getElementById('closeVideo');

function openVideo() {
  if (!videoLayer || !weddingVideo) return;

  if (bgMusic && musicOn) bgMusic.pause();

  videoLayer.classList.add('show');
  weddingVideo.currentTime = 0;
  weddingVideo.play().catch(() => {});
}

function closeVideoPlayer() {
  if (!videoLayer || !weddingVideo) return;

  weddingVideo.pause();
  videoLayer.classList.remove('show');

  if (bgMusic && musicOn) bgMusic.play().catch(() => {});
}

if (videoBtn) videoBtn.addEventListener('click', openVideo);
if (closeVideo) closeVideo.addEventListener('click', closeVideoPlayer);
if (videoLayer) {
  videoLayer.addEventListener('click', e => {
    if (e.target === videoLayer) closeVideoPlayer();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./service-worker.js').catch(() => {})
  );
}
