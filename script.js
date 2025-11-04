// Basic multiple-choice gate + YouTube loader + lightweight confetti
const quizForm = document.getElementById('quizForm');
const feedback = document.getElementById('feedback');
const quizCard = document.getElementById('quizCard');
const videoSection = document.getElementById('videoSection');
const playBtn = document.getElementById('playBtn');
const unmuteBtn = document.getElementById('unmuteBtn');

let ytApiLoaded = false;
let player = null;
const VIDEO_ID = 'Dytw4JlyFec'; // from the provided Shorts link
const CORRECT_PREFIX = 'ถูก_';

quizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(quizForm);
  const ans = data.get('answer');
  if (!ans) return;

  if (String(ans).startsWith(CORRECT_PREFIX)) {
    feedback.className = 'feedback ok';
    feedback.textContent = 'ถูกต้อง! พร้อมรับชมได้เลย 🎉';
    // reveal video section
    quizCard.classList.add('hidden');
    videoSection.classList.remove('hidden');
    videoSection.setAttribute('aria-hidden', 'false');
    // celebration
    launchConfetti(100);
    // lazy-load YouTube API
    ensureYouTubeApi();
  } else {
    feedback.className = 'feedback bad';
    feedback.textContent = 'ยังไม่ใช่น้า~ ลองอีกครั้งนะ ❤️';
    wiggle(quizCard);
  }
});

playBtn.addEventListener('click', () => {
  if (!player) {
    createPlayer();
  } else {
    try {
      player.playVideo();
    } catch {}
  }
});

unmuteBtn.addEventListener('click', () => {
  if (player) {
    try {
      player.unMute();
      unmuteBtn.classList.add('hidden');
    } catch {}
  }
});

function ensureYouTubeApi(){
  if (ytApiLoaded) return;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  ytApiLoaded = true;
}

// YT API will call this on global scope
window.onYouTubeIframeAPIReady = () => {
  // do nothing yet; we create the player on user click to comply with autoplay policies
};

function createPlayer(){
  player = new YT.Player('player', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
      controls: 1
    },
    events: {
      onReady: (ev) => {
        // on mobile, autoplay requires muted first; provide unmute button
        try {
          ev.target.mute();
          ev.target.playVideo();
          unmuteBtn.classList.remove('hidden');
        } catch {}
      }
    }
  });
}

function wiggle(el){
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 250, easing: 'ease-in-out' }
  );
}

/* lightweight confetti */
function launchConfetti(count=80){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const pieces = Array.from({length: count}, () => ({
    x: Math.random()*W,
    y: -20 - Math.random()*H*0.3,
    r: 4 + Math.random()*6,
    a: Math.random()*2*Math.PI,
    v: 1.5 + Math.random()*2.5,
    s: 0.005 + Math.random()*0.01
  }));

  let raf = null;
  function draw(){
    ctx.clearRect(0,0,W,H);
    for (const p of pieces){
      p.y += p.v;
      p.a += p.s * 60;
      const size = p.r*(0.6 + 0.4*Math.sin(p.a));
      // random-ish hues without setting fixed colors
      ctx.fillStyle = `hsl(${(p.a*180/Math.PI)%360}, 90%, 60%)`;
      ctx.fillRect(p.x, p.y, size, size);
      if (p.y > H+20) {
        p.y = -20; p.x = Math.random()*W;
      }
    }
    raf = requestAnimationFrame(draw);
  }
  draw();

  setTimeout(()=>{
    cancelAnimationFrame(raf);
    ctx.clearRect(0,0,W,H);
  }, 3000);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { once:true });
}
