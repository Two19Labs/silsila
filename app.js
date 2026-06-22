/* --------------------------------------------------
   SILSILA INTERACTIVE SCRIPT
   Handles tabs, ambient sounds, and postcard drops.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initAmbientPlayer();
    initPostcardInteractive();
    initScrollAnimations();
});

/* 1. Tab Switching (Menu & Lookbook) */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active states to current
            btn.classList.add('active');
            const activePane = document.getElementById(targetTab);
            if (activePane) activePane.classList.add('active');
        });
    });
}

/* 2. Web Audio API Synthesized Himalayan Soundscape */
function initAmbientPlayer() {
    const ambientToggle = document.getElementById('ambientToggle');
    const soundWave = document.getElementById('soundWave');
    
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
        windFilter.Q.value = 2.0;

        // Modulate filter frequency with LFO to simulate wind gust sweeps
        lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // extremely slow sweeps (20s cycle)

        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 250; // Sweep range in Hz

        lfo.connect(lfoGain);
        lfoGain.connect(windFilter.frequency);

        windFilter.frequency.value = 350; // Base cutoff frequency

        const windGain = audioCtx.createGain();
        windGain.gain.value = 0.25; // Base wind volume

        windSource.connect(windFilter);
        windFilter.connect(windGain);

        // --- Rain Synthesis ---
        rainSource = audioCtx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const rainFilter = audioCtx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.value = 1000;
        rainFilter.Q.value = 0.8;

        const rainGain = audioCtx.createGain();
        rainGain.gain.value = 0.12; // Rain is softer

        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);

        // --- Master Connection ---
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.5;

        windGain.connect(gainNode);
        rainGain.connect(gainNode);
        
        gainNode.connect(audioCtx.destination);

        // Start playing
        windSource.start(0);
        rainSource.start(0);
        lfo.start(0);
        isPlaying = true;

        soundWave.classList.add('playing');
        ambientToggle.querySelector('.ambient-icon').textContent = '🏔️';
    }

    function stopSoundscape() {
        if (windSource) {
            windSource.stop();
            windSource.disconnect();
        }
        if (rainSource) {
            rainSource.stop();
            rainSource.disconnect();
        }
        if (lfo) {
            lfo.stop();
            lfo.disconnect();
        }
        isPlaying = false;
        
        soundWave.classList.remove('playing');
        ambientToggle.querySelector('.ambient-icon').textContent = '🌿';
    }

    ambientToggle.addEventListener('click', () => {
        if (!isPlaying) {
            startSoundscape();
        } else {
            stopSoundscape();
        }
    });
}

/* 3. Postcard Drag & Place, Custom Stamps, Drop Animations */
function initPostcardInteractive() {
    const stampOptions = document.querySelectorAll('.stamp-option');
    const stampSlot = document.getElementById('stampSlot');
    const sendBtn = document.getElementById('sendPostcardBtn');
    const postcardSide = document.querySelector('.postcard-side');
    const successMsg = document.getElementById('successMsg');
    const resetBtn = document.getElementById('resetPostcardBtn');
    const mailbox = document.getElementById('mailboxContainer');

    let selectedStamp = null;

    // Stamp Placement (Interactive Postcard Concept)
    stampOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            // Remove previous stamp from slot if any
            stampSlot.innerHTML = '';
            
            // Mark option as selected
            stampOptions.forEach(o => o.classList.remove('placed'));
            opt.classList.add('placed');

            // Clone stamp design and place it inside the slot
            const stampDesign = opt.querySelector('.stamp-design').cloneNode(true);
            stampDesign.style.cursor = 'default';
            stampDesign.style.boxShadow = 'none';
            stampDesign.style.transform = 'rotate(-3deg)';
            
            stampSlot.appendChild(stampDesign);
            selectedStamp = opt.getAttribute('data-stamp');
        });
    });

    // Send Form Interaction
    sendBtn.addEventListener('click', (e) => {
        const message = document.getElementById('postcardMessage').value.trim();
        const name = document.getElementById('postcardName').value.trim();
        const email = document.getElementById('postcardEmail').value.trim();

        if (!message || !name || !email) {
            alert('Please fill out your message, name, and email before dropping the postcard!');
            return;
        }

        if (!selectedStamp) {
            alert('Please select and place a stamp on your postcard before mailing!');
            return;
        }

        // Trigger Send Animation Sequence
        postcardSide.classList.add('sending');

        // Light up Mailbox
        setTimeout(() => {
            mailbox.querySelector('.mailbox').classList.add('drag-hover');
        }, 300);

        // After animation completes (1.5s), display success card
        setTimeout(() => {
            successMsg.style.display = 'flex';
            mailbox.querySelector('.mailbox').classList.remove('drag-hover');
        }, 1500);
    });

    // Reset Form
    resetBtn.addEventListener('click', () => {
        document.getElementById('postcardMessage').value = '';
        document.getElementById('postcardName').value = '';
        document.getElementById('postcardEmail').value = '';
        
        // Reset Stamp
        stampSlot.innerHTML = '<span class="stamp-placeholder">Place Stamp Here</span>';
        stampOptions.forEach(o => o.classList.remove('placed'));
        selectedStamp = null;

        // Reset Styles
        postcardSide.classList.remove('sending');
        successMsg.style.display = 'none';
    });
}

/* 4. Timeline Scroll Reveal Animations */
function initScrollAnimations() {
    const timelineSteps = document.querySelectorAll('.timeline-step');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineSteps.forEach(step => {
        // Set initial styling for transitions
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        revealObserver.observe(step);
    });
}
