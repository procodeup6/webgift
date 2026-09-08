/* ==========================================================================
   SCRIPT.JS - WEBSITE FUNCTIONALITY & INTERACTIVITY
   Kaam: Yeh file photo slider, music playback, scratch cards aur animations 
   ke saare logical functions ko run karti hai.
   ========================================================================== */

/* --------------------------------------------------------------------------
   PART 1: PHOTO MEMORIES SLIDER LOGIC
   Kaam: Google Drive IDs se photos uthana, previous/next button par change karna
   -------------------------------------------------------------------------- */
const driveIds = [
  "1orf3t-JoAsXODB67IVwwb2ssIiq2vfu8",
  "1XONsoB6sgHWXMCAmWSt69G3HkuXXVMd6",
  "1oamWdE87cNaQELuea25eedVfEBvhf3xQ",
  "1hrq-kI-o5ylv2DYilV0Pv_tJfhG-ZGep",
  "1FRdR8pljFpFpLdohyDAk2TVYYLQX2Pzo",
  "1VjbSAq0zIe9fuKAUkNcO6Y8nHLyAm-X-",
  "1BetLLdWSG2jh_CYkmsF4EP_SJaWSF5O7",
  "1vzdug0uG4evdnrUS604pFo66Er2zUNA0",
  "1nQG3zxOB9zNFYdp7LJXX1xfQc3Xm79b5",
  "1csr0ClZP4PY-QCOzcwKBt0o-sL-apL5f",
  "1ZnVgtmr6Jea-PH5QtLbG_0mxzHef9rpR",
  "1RutRrSrKIIaZz8qucBjncpbRak33joNP",
  "1FZOPaQKinIKUxDi07s3mgOGYd6WcJYS8",
  "11zx0EiFOd2CqfONS3xCvPsoEObPItOoB",
];

const imgQt = [
  "Hamari pyari yaadein ❤️",
  "Bachpan ki masti aur shaitani 😜",
  "TV remote ke liye ladaiyan 😂",
  "Tere gusse ka asli reason 🤭",
  "Meri chudelgiri ka proof 😎",
  "Tere liye mera pyaar 💖",
  "Hamari secret language 🤫",
  "दावत बड़ी हो या छोटी, बात तो बस दिल से खिलाने की है 🍲",
  "Hamesha saath, hamesha besties 👯‍♀️"
];

// Drive ID aur captions ko photoList array mein convert karna
const photoList = driveIds.map((id, index) => ({
  url: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
  title: `Memory #${index + 1}`,
  desc: imgQt[index],
  emoji: "📸"
}));

let currentPhotoIdx = 0;
const polaroidImg = document.getElementById('polaroid-img');
const photoTitle = document.getElementById('photo-title');
const photoDesc = document.getElementById('photo-desc');
const photoEmoji = document.getElementById('photo-emoji');
const photoCounter = document.getElementById('photo-counter');
const photoDots = document.getElementById('photo-dots');

// Photos ke neeche gol dots banana
function initPhotoDots() {
  if (!photoDots) return;
  photoDots.innerHTML = '';
  photoList.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.className = `w-2 h-2 rounded-full transition-all ${idx === currentPhotoIdx ? 'bg-deepPlum w-4' : 'bg-stone-300'}`;
    photoDots.appendChild(dot);
  });
}

// Current index ke mutabiq photo render karna
function renderPhoto(index) {
  if (!polaroidImg) return;
  currentPhotoIdx = (index + photoList.length) % photoList.length;
  polaroidImg.style.opacity = '0';
  setTimeout(() => {
    const item = photoList[currentPhotoIdx];
    polaroidImg.src = item.url;
    photoTitle.innerText = item.title;
    photoDesc.innerText = item.desc;
    photoEmoji.innerText = item.emoji;
    photoCounter.innerText = `${currentPhotoIdx + 1} / ${photoList.length}`;
    polaroidImg.style.opacity = '1';
    initPhotoDots();
  }, 200);
}

function nextPhoto() { renderPhoto(currentPhotoIdx + 1); }
function prevPhoto() { renderPhoto(currentPhotoIdx - 1); }

// Website load hote hi pehli photo dikhana
renderPhoto(0);

/* --------------------------------------------------------------------------
   PART 2: VIDEO SURPRISE UNLOCK LOGIC
   Kaam: Gift box click hone par confetti urana aur video show karna
   -------------------------------------------------------------------------- */
const videoList = [
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Our Craziest Clip 🎬",
    caption: "Yeh video dekh ke hamesha chehre par smile aa jati hai!"
  },
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Sibling Laughter Therapy 😂",
    caption: "Bina kisi reason ke hasna koi humse seekhe!"
  }
];

let currentVideoIdx = 0;
const lockedBox = document.getElementById('video-locked-box');
const unlockedBox = document.getElementById('video-unlocked-box');
const videoPlayer = document.getElementById('main-video-player');
const videoSource = document.getElementById('video-source');
const videoTitle = document.getElementById('current-video-title');
const videoCaption = document.getElementById('current-video-caption');
const videoCounter = document.getElementById('video-counter');

function updateVideoDisplay(idx) {
  if (!videoPlayer) return;
  currentVideoIdx = (idx + videoList.length) % videoList.length;
  const v = videoList[currentVideoIdx];

  videoSource.src = v.src;
  videoPlayer.load();
  videoTitle.innerText = v.title;
  videoCaption.innerText = v.caption;
  videoCounter.innerText = `${currentVideoIdx + 1} / ${videoList.length}`;
  videoPlayer.play().catch(() => {});
}

function nextVideo() { updateVideoDisplay(currentVideoIdx + 1); }
function prevVideo() { updateVideoDisplay(currentVideoIdx - 1); }

// Video Surprise Unlock Button function
function unlockVideoSurprise() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }

  if (lockedBox) {
    lockedBox.style.opacity = '0';
    setTimeout(() => {
      lockedBox.style.display = 'none';
      if (unlockedBox) {
        unlockedBox.classList.remove('hidden');
        updateVideoDisplay(0);
      }
    }, 400);
  }
}

/* --------------------------------------------------------------------------
   PART 3: AUDIO ENGINE & LANDING SCREEN (OPEN GIFT)
   Kaam: OPEN GIFT button dabate hi overlay band karna aur music automatic start karna
   -------------------------------------------------------------------------- */
let isMusicPlaying = false;
const bgAudio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('music-btn');

function playMusic() {
  if (!bgAudio) return;
  bgAudio.play().then(() => {
    isMusicPlaying = true;
    if (musicBtn) musicBtn.innerText = '🎵'; // Icon change to Pause
  }).catch((err) => {
    console.log("Autoplay waiting for user gesture:", err);
  });
}

// Floating Music Button: Click karne par Pause / Play
function toggleMusic() {
  if (!bgAudio) return;
  if (isMusicPlaying) {
    bgAudio.pause();
    isMusicPlaying = false;
    if (musicBtn) musicBtn.innerText = '⏸️'; // Icon change to Music Note
  } else {
    playMusic();
  }
}

// OPEN MY GIFT Button Function (Landing overlay band karke music bajata hai)
function openGiftScreen() {
  const welcome = document.getElementById('welcome-screen');
  if (welcome) {
    welcome.style.opacity = '0';
    welcome.style.transform = 'scale(1.08)';
    welcome.style.pointerEvents = 'none';

    setTimeout(() => {
      welcome.style.display = 'none';
    }, 700);
  }

  // Gift open hote hi gaana bajna shuru hoga
  playMusic();
}

// Browser Autoplay Fallback: Screen par pehla tap/click hote hi music start karne ki koshish
document.addEventListener('pointerdown', function startMusicOnce() {
  if (!isMusicPlaying) {
    playMusic();
  }
}, { once: true });

/* --------------------------------------------------------------------------
   PART 4: CHEER-UP JAR & CONFETTI SHOWER
   Kaam: Jar button dabate hi naya funny quote show karna aur hearts urana
   -------------------------------------------------------------------------- */
function triggerLoveShower() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

const cheerNotes = [
  "Tere jaisi nautanki aur pyaari behen pure brahmand me kisi ke paas nahi hai. Smile kar ab! 😊",
  "Kisine kuch bola kya? Naam bata uska, abhi danda leke nikalta hoon! 😤🏏",
  "Tu tension mat liya kar, tera bhai zinda hai abhi! Sab sambhal lenge. 💪",
  "Rona band kar! Jyada emotional mat ho, warna bachpan ki photos leak kar dunga! 😜📸",
  "Chal ready ho ja, aaj sham ko teri favorite ice-cream meri taraf se! 🍦🍨"
];

let lastNoteIdx = 0;
function pullNewNote() {
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * cheerNotes.length);
  } while (nextIdx === lastNoteIdx);
  lastNoteIdx = nextIdx;

  const quoteEl = document.getElementById('jar-quote');
  if (quoteEl) {
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.innerText = `"${cheerNotes[nextIdx]}"`;
      quoteEl.style.opacity = '1';
    }, 200);
  }

  triggerLoveShower();
}

/* --------------------------------------------------------------------------
   PART 5: FLOATING BUBBLES GENERATOR
   Kaam: Screen par random size aur speed ke 22 bubbles generate karna
   -------------------------------------------------------------------------- */
function createBubbles() {
  const container = document.getElementById('bubble-container');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 35 + 15; // 15px se 50px random diameter
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 5 + 6}s`; // 6 se 11 second speed
    bubble.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(bubble);
  }
}
createBubbles();

/* --------------------------------------------------------------------------
   PART 6: SCRATCH CARDS CANVAS (MOUSE & MOBILE TOUCH)
   Kaam: Card ke upar golden coating banana aur ungli/cursor ghumane par mitana
   -------------------------------------------------------------------------- */
document.querySelectorAll('.scratch-card').forEach((card) => {
  const canvas = card.querySelector('.scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Canvas size fix karna aur golden color paint karna
  function initCanvas() {
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;

    ctx.fillStyle = '#9b8846'; // Golden / Bronze color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#fef3c7';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', canvas.width / 2, canvas.height / 2 + 5);
  }

  initCanvas();

  let isDrawing = false;

  // Scratch karne ka formula (destination-out se transparent hole banta hai)
  function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2); // 22px scratch radius
    ctx.fill();
  }

  // Desktop Mouse Listeners
  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  window.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => { isDrawing = false; });

  // Mobile Touch Listeners (prevent screen scroll while scratching)
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(e);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Screen scroll hone se rokta hai
    scratch(e);
  }, { passive: false });

  canvas.addEventListener('touchend', () => { isDrawing = false; });
});
