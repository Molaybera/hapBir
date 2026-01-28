/* --- Configuration --- */
const CONFIG = {
    message: "To the most amazing girl. ✨ The world is brighter with you in it. I hope your day is as beautiful as your smile. Happy Birthday!💖 and yes thoses eye are mine ohh sorry the girl itself is mine😁",
    heartsToWin: 5,
    photos: [
        "./img/1.jpg",
        "./img/2.jpg",
        "./img/3.jpg",
        "./img/4.png",
        "./img/5.jpg",
        "./img/6.jpg",
    ]
};

/* --- Game Logic --- */
let score = 0;
let gameActive = true;
const heartSpawner = document.getElementById('heart-spawner');

// Start Heart Spawner
const spawnerInterval = setInterval(() => {
    if (!gameActive) return;
    const heart = document.createElement('div');
    heart.classList.add('game-heart');
    heart.innerHTML = ['💗', '💘', '💝'][Math.floor(Math.random()*3)];
    heart.style.left = Math.random() * 80 + 10 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's';
    
    const pop = (e) => {
        e.preventDefault(); e.stopPropagation();
        heart.style.transform = "scale(1.5)"; heart.style.opacity = "0";
        setTimeout(() => heart.remove(), 200);
        score++;
        document.getElementById('progress-fill').style.width = (score/CONFIG.heartsToWin)*100 + '%';
        if (score >= CONFIG.heartsToWin) winGame();
    };
    heart.addEventListener('click', pop);
    heart.addEventListener('touchstart', pop, {passive: false});
    heartSpawner.appendChild(heart);
    setTimeout(() => { if(heart.parentNode) heart.remove(); }, 7000);
}, 800);

document.getElementById('progress-container').style.display = 'block';
function winGame() {
    gameActive = false; clearInterval(spawnerInterval);
    heartSpawner.innerHTML = '';
    document.getElementById('instructions').innerHTML = "Perfect! ✨";
    setTimeout(() => {
        document.getElementById('game-ui').style.display = 'none';
        const card = document.getElementById('main-card');
        card.classList.remove('hidden');
        setTimeout(() => card.classList.add('visible'), 50);
    }, 1000);
}

/* --- Stage Transitions --- */

// 1. Gift -> Envelope
document.getElementById('gift-btn').addEventListener('click', () => {
    spawnBalloons(); // Start balloons immediately
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    document.getElementById('gift-stage').style.display = 'none';
    const envStage = document.getElementById('envelope-stage');
    envStage.classList.remove('hidden');
    envStage.style.display = 'flex';
});

// 2. Open Envelope
document.getElementById('envelope-btn').addEventListener('click', function() {
    if(this.classList.contains('open')) return;
    this.classList.add('open');
    document.getElementById('env-hint').style.display = 'none';
    
    // Slide envelope out and show content
    setTimeout(() => {
        this.style.display = 'none';
        document.getElementById('opened-letter-content').style.display = 'flex';
        typeWriter(document.getElementById('typewriter-area'), CONFIG.message);
        startSlideshow();
    }, 800);
});

// 3. Letter -> Cake (Changed Flow)
document.getElementById('to-cake-btn').addEventListener('click', () => {
    const envStage = document.getElementById('envelope-stage');
    const cakeStage = document.getElementById('cake-stage');
    
    envStage.style.opacity = 0;
    setTimeout(() => {
        envStage.style.display = 'none';
        cakeStage.style.display = 'flex';
        setTimeout(() => cakeStage.style.opacity = 1, 50);
    }, 500);
});

// 4. Cake -> Scratch Card (New Flow)
document.getElementById('to-scratch-btn').addEventListener('click', () => {
    const cakeStage = document.getElementById('cake-stage');
    const scratchStage = document.getElementById('scratch-stage');
    
    cakeStage.style.opacity = 0;
    setTimeout(() => {
        cakeStage.style.display = 'none';
        scratchStage.style.display = 'flex';
        // Init Canvas
        initScratchCard();
        setTimeout(() => scratchStage.style.opacity = 1, 50);
    }, 500);
});

/* --- Helper Functions --- */
// Slideshow
// Slideshow - Fixed Timing & Preloading
function startSlideshow() {
    const img = document.getElementById('slideshow-img');
    let idx = 0;
    
    // PRELOADER: Loads images in background so they don't lag
    CONFIG.photos.forEach(src => {
        const i = new Image();
        i.src = src;
    });

    img.src = CONFIG.photos[0];
    
    setInterval(() => {
        // 1. Fade Out
        img.style.opacity = 0;
        
        // 2. Wait exactly 500ms (matches CSS transition) then swap
        setTimeout(() => {
            idx = (idx + 1) % CONFIG.photos.length;
            img.src = CONFIG.photos[idx];
            
            // 3. Fade In
            img.onload = () => { img.style.opacity = 1; };
            // Fallback in case onload misses (cached images)
            setTimeout(() => { img.style.opacity = 1; }, 50); 
            
        }, 500); 
    }, 2500); // Change image every 2.5 seconds
}

// Typewriter
function typeWriter(el, text, i = 0) {
    if (i < text.length) {
        el.innerHTML += text.charAt(i);
        el.scrollTop = el.scrollHeight;
        setTimeout(() => typeWriter(el, text, i + 1), 40);
    } else {
        // Show button to go to Cake
        setTimeout(() => document.getElementById('to-cake-btn').classList.remove('hidden'), 500);
    }
}

// Balloons
function spawnBalloons() {
    const bg = document.getElementById('balloon-bg');
    const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb'];
    // Create loop
    setInterval(() => {
        const b = document.createElement('div');
        b.classList.add('balloon');
        b.style.left = Math.random() * 100 + 'vw';
        b.style.background = colors[Math.floor(Math.random() * colors.length)];
        // Random speed between 5s and 10s
        b.style.animationDuration = (Math.random() * 5 + 5) + 's';
        bg.appendChild(b);
        setTimeout(() => b.remove(), 10000);
    }, 500); // More frequent balloons
}

// Scratch Card Logic
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Set canvas size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Fill with overlay color
    ctx.fillStyle = "#dfe6e9"; // Silver/Gray
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text on overlay
    ctx.fillStyle = "#636e72";
    ctx.font = "bold 20px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here! ❤️", canvas.width/2, canvas.height/2);
    let isDrawing = false;
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Simple check to reveal message
        if(Math.random() > 0.95) {
            document.getElementById('final-msg').classList.remove('hidden');
        }
    }
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        if(e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    // Events
    const start = () => isDrawing = true;
    const end = () => isDrawing = false;
    const move = (e) => {
        if(!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        scratch(pos.x, pos.y);
    };
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('touchstart', start);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('touchmove', move, {passive: false});
}

// Cake Flame
document.getElementById('flame').addEventListener('click', function() {
    this.classList.add('out');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    
    setTimeout(() => {
        document.getElementById('wished-msg').classList.remove('hidden');
        // Show button to go to Scratch Card
        setTimeout(() => {
            document.getElementById('to-scratch-btn').classList.remove('hidden');
        }, 1000);
    }, 500);
});
