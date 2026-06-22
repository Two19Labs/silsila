/* --------------------------------------------------
   SILSILA DYNAMIC INTERACTIONS
   Parallax scroll, follow-mouse previews, reveal scroll observers.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initHeroParallax();
    initScrollReveal();
    initMouseFollowPreview();
    initAmbientPlayer();
    initContactForm();
});

/* 1. Header Hide/Show on Scroll */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 120) {
            header.classList.remove('hide');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('hide')) {
            // Scrolling down
            header.classList.add('hide');
        } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
            // Scrolling up
            header.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });
}

/* 2. Parallax Scroll Effect for Hero */
function initHeroParallax() {
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrollOffset = window.scrollY;
        // Limit parallax calculations to performance boundary
        if (scrollOffset < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollOffset * 0.35}px)`;
        }
    });
}

/* 3. Scroll Reveal Observers */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-img');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* 4. Mouse-Follow Image Preview (Menu Page Effect) */
function initMouseFollowPreview() {
    const menuItems = document.querySelectorAll('.menu-item-row');
    const previewContainer = document.getElementById('floatingPreview');
    const previewImg = document.getElementById('previewImg');
    
    if (!menuItems.length || !previewContainer || !previewImg) return;

    // Map preview data tags to visual assets
    const assetsMap = {
        coffee: 'assets/coffee.png',
        pourover: 'assets/pourover.png',
        bites: 'assets/bites.png'
    };

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const previewTag = item.getAttribute('data-preview');
            const imgSrc = assetsMap[previewTag] || 'assets/coffee.png';
            
            previewImg.src = imgSrc;
            previewContainer.classList.add('active');
        });

        item.addEventListener('mousemove', (e) => {
            // Adjust position offsets to hover comfortably next to the mouse cursor
            const xOffset = 30;
            const yOffset = 30;
            
            previewContainer.style.left = `${e.clientX + xOffset}px`;
            previewContainer.style.top = `${e.clientY + yOffset}px`;
        });

        item.addEventListener('mouseleave', () => {
            previewContainer.classList.remove('active');
        });
    });
}

/* 5. Web Audio API Synthesized Ambient Soundscape */
function initAmbientPlayer() {
    const ambientToggle = document.getElementById('ambientToggle');
    if (!ambientToggle) return;
    
    const statusDot = ambientToggle.querySelector('.sound-status-dot');
    const toggleText = ambientToggle.querySelector('.sound-toggle-text');
    
    let audioCtx = null;
    let isPlaying = false;
    let windSource = null;
    let rainSource = null;
    let lfo = null;
    let gainNode = null;

    // Generate White Noise Buffer
    function createNoiseBuffer(ctx) {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return noiseBuffer;
    }

    function startSoundscape() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const noiseBuffer = createNoiseBuffer(audioCtx);

            // --- Wind Synthesis ---
            windSource = audioCtx.createBufferSource();
            windSource.buffer = noiseBuffer;
            windSource.loop = true;

            const windFilter = audioCtx.createBiquadFilter();
            windFilter.type = 'lowpass';
            windFilter.Q.value = 1.5;

            // Modulate filter frequency with LFO to simulate wind sweeps
            lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.05; // Sweep frequency

            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 220; // Range

            lfo.connect(lfoGain);
            lfoGain.connect(windFilter.frequency);

            windFilter.frequency.value = 320; // Cutoff baseline

            const windGain = audioCtx.createGain();
            windGain.gain.value = 0.2;

            windSource.connect(windFilter);
            windFilter.connect(windGain);

            // --- Rain Synthesis ---
            rainSource = audioCtx.createBufferSource();
            rainSource.buffer = noiseBuffer;
            rainSource.loop = true;

            const rainFilter = audioCtx.createBiquadFilter();
            rainFilter.type = 'bandpass';
            rainFilter.frequency.value = 900;
            rainFilter.Q.value = 1.0;

            const rainGain = audioCtx.createGain();
            rainGain.gain.value = 0.08;

            rainSource.connect(rainFilter);
            rainFilter.connect(rainGain);

            // --- Connections ---
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.5;

            windGain.connect(gainNode);
            rainGain.connect(gainNode);
            
            gainNode.connect(audioCtx.destination);

            windSource.start(0);
            rainSource.start(0);
            lfo.start(0);
            isPlaying = true;

            statusDot.classList.add('playing');
            toggleText.textContent = 'Mute Ambient Sound';
        } catch (e) {
            console.warn('Audio synthesis engine failure:', e);
        }
    }

    function stopSoundscape() {
        if (windSource) {
            try { windSource.stop(); } catch(e){}
            windSource.disconnect();
        }
        if (rainSource) {
            try { rainSource.stop(); } catch(e){}
            rainSource.disconnect();
        }
        if (lfo) {
            try { lfo.stop(); } catch(e){}
            lfo.disconnect();
        }
        isPlaying = false;
        
        statusDot.classList.remove('playing');
        toggleText.textContent = 'Play Mountain Ambient';
    }

    ambientToggle.addEventListener('click', () => {
        if (!isPlaying) {
            startSoundscape();
        } else {
            stopSoundscape();
        }
    });
}

/* 6. Letter Form Submission with Wax Seal drops */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');
    const waxSeal = document.getElementById('waxSeal');

    if (!contactForm || !successMsg || !resetBtn || !waxSeal) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Animate form card fade
        contactForm.style.transition = 'opacity 0.4s ease';
        contactForm.style.opacity = '0';

        setTimeout(() => {
            contactForm.style.display = 'none';
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            successMsg.style.transition = 'opacity 0.4s ease';
            
            // Reflow
            successMsg.offsetHeight;
            successMsg.style.opacity = '1';

            // Trigger Wax Seal drop animation
            setTimeout(() => {
                waxSeal.classList.add('stamped');
            }, 150);
        }, 400);
    });

    resetBtn.addEventListener('click', () => {
        // Clear Inputs
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';

        // Reset elements
        successMsg.style.opacity = '0';
        waxSeal.classList.remove('stamped');

        setTimeout(() => {
            successMsg.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.style.opacity = '0';
            
            // Reflow
            contactForm.offsetHeight;
            contactForm.style.opacity = '1';
        }, 400);
    });
}
