/* --------------------------------------------------
   SILSILA EDITORIAL SCRIPT
   Scroll reveals, layout transitions, and letter form interactions.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initScrollReveal();
    initContactForm();
});

/* 1. Header Hide/Show on Scroll */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
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

/* 2. Scroll Reveal Observers (Intersection Observer) */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-img');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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

/* 3. Letter Form Submission with Wax Seal Animation */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');
    const waxSeal = document.getElementById('waxSeal');

    if (!contactForm || !successMsg || !resetBtn || !waxSeal) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fade out form
        contactForm.style.transition = 'opacity 0.4s ease';
        contactForm.style.opacity = '0';

        setTimeout(() => {
            contactForm.style.display = 'none';
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            successMsg.style.transition = 'opacity 0.4s ease';
            
            // Trigger reflow
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
