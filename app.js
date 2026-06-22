/* --------------------------------------------------
   SILSILA EDITORIAL SCRIPT
   Slideshows, parallax observers, mouse follow previews.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initHeroSlideshow();
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

        if (currentScroll <= 100) {
            header.classList.remove('hide');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('hide')) {
            header.classList.add('hide');
        } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
            header.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });
}

/* 2. Hero Split Fading Slideshow */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (!slides.length) return;

    let currentIndex = 0;
    const slideInterval = 4000; // 4 seconds

    function showNextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }

    setInterval(showNextSlide, slideInterval);
}

/* 3. Scroll Reveal Observers */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-img');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* 4. Mouse-Follow Image Preview (Menu Row Effect) */
function initMouseFollowPreview() {
    const menuRows = document.querySelectorAll('.menu-item-row');
    const previewContainer = document.getElementById('floatingPreview');
    const previewImg = document.getElementById('previewImg');

    if (!menuRows.length || !previewContainer || !previewImg) return;

    // Direct mapping of previews to visual files
    const assetsMap = {
        coffee: 'assets/coffee.png',
        pourover: 'assets/pourover.png',
        bites: 'assets/bites.png',
        fashion: 'assets/fashion.png'
    };

    menuRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const previewTag = row.getAttribute('data-preview');
            const imgSrc = assetsMap[previewTag] || 'assets/coffee.png';
            
            previewImg.src = imgSrc;
            previewContainer.classList.add('active');
        });

        row.addEventListener('mousemove', (e) => {
            const xOffset = 25;
            const yOffset = 25;
            
            previewContainer.style.left = `${e.clientX + xOffset}px`;
            previewContainer.style.top = `${e.clientY + yOffset}px`;
        });

        row.addEventListener('mouseleave', () => {
            previewContainer.classList.remove('active');
        });
    });
}

/* 5. Web Audio API Synthesized Soundscape */
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
        const bufferSize = ctx.sampleRate * 2;
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
            windFilter.Q.value = 1.2;

            lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.05; // 20s sweep

            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 180;

            lfo.connect(lfoGain);
            lfoGain.connect(windFilter.frequency);

            windFilter.frequency.value = 300;

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
            rainFilter.frequency.value = 950;
            rainFilter.Q.value = 0.8;

            const rainGain = audioCtx.createGain();
            rainGain.gain.value = 0.08;

            rainSource.connect(rainFilter);
            rainFilter.connect(rainGain);

            // --- Connecting nodes ---
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.4;

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
            console.warn('Audio Synthesis engine failed:', e);
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

        // Animate out the form
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

            // Trigger seal drop
            setTimeout(() => {
                waxSeal.classList.add('stamped');
            }, 100);
        }, 400);
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';

        successMsg.style.opacity = '0';
        waxSeal.classList.remove('stamped');

        setTimeout(() => {
            successMsg.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.style.opacity = '0';
            
            contactForm.offsetHeight;
            contactForm.style.opacity = '1';
        }, 400);
    });
}
