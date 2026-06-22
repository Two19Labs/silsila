/* --------------------------------------------------
   SILSILA EDITORIAL CODE
   Minimalist interaction handlers.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientPlayer();
    initContactForm();
});

/* 1. Web Audio API Synthesized Himalayan Soundscape */
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

            // Modulate filter frequency with LFO to simulate wind gust sweeps
            lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.04; // extremely slow sweeps (25s cycle)

            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 200; // Sweep range in Hz

            lfo.connect(lfoGain);
            lfoGain.connect(windFilter.frequency);

            windFilter.frequency.value = 300; // Base cutoff frequency

            const windGain = audioCtx.createGain();
            windGain.gain.value = 0.22; // Base wind volume

            windSource.connect(windFilter);
            windFilter.connect(windGain);

            // --- Rain Synthesis ---
            rainSource = audioCtx.createBufferSource();
            rainSource.buffer = noiseBuffer;
            rainSource.loop = true;

            const rainFilter = audioCtx.createBiquadFilter();
            rainFilter.type = 'bandpass';
            rainFilter.frequency.value = 950;
            rainFilter.Q.value = 0.9;

            const rainGain = audioCtx.createGain();
            rainGain.gain.value = 0.1; // Rain is softer

            rainSource.connect(rainFilter);
            rainFilter.connect(rainGain);

            // --- Master Connection ---
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.4;

            windGain.connect(gainNode);
            rainGain.connect(gainNode);
            
            gainNode.connect(audioCtx.destination);

            // Start playing
            windSource.start(0);
            rainSource.start(0);
            lfo.start(0);
            isPlaying = true;

            statusDot.classList.add('playing');
            toggleText.textContent = 'Mute Ambient Sound';
        } catch (e) {
            console.warn('Audio Synthesis failed to initialize: ', e);
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

/* 2. Contact Form Transitions */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    if (!contactForm || !successMsg || !resetBtn) return;

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
            
            // Force a reflow
            successMsg.offsetHeight;
            successMsg.style.opacity = '1';
        }, 400);
    });

    resetBtn.addEventListener('click', () => {
        // Reset form inputs
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';

        // Animate out success message
        successMsg.style.opacity = '0';

        setTimeout(() => {
            successMsg.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.style.opacity = '0';
            
            // Force a reflow
            contactForm.offsetHeight;
            contactForm.style.opacity = '1';
        }, 400);
    });
}
