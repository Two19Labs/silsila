/* --------------------------------------------------
   SILSILA INTERACTIVE SCRIPT
   Interactive booking form, guest counter, and scroll effects.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initGuestCounter();
    initBookingForm();
    initMenuCarousels();
});

/* 1. Header Hide/Show on Scroll */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // At the very top, remove classes
        if (currentScroll <= 80) {
            header.classList.remove('scroll-down', 'scroll-up');
            return;
        }

        // Scrolling down
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } 
        // Scrolling up
        else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

/* 2. Interactive Guest Selector (Counter) */
let guestCount = 2; // Default guests

function initGuestCounter() {
    const btnDec = document.getElementById('btnGuestDec');
    const btnInc = document.getElementById('btnGuestInc');
    const display = document.getElementById('guestCountDisplay');

    if (!btnDec || !btnInc || !display) return;

    btnDec.addEventListener('click', () => {
        if (guestCount > 1) {
            guestCount--;
            display.textContent = guestCount;
        }
    });

    btnInc.addEventListener('click', () => {
        if (guestCount < 10) {
            guestCount++;
            display.textContent = guestCount;
        }
    });
}

/* 3. Table Booking Form Submission & Success Receipt */
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const successMsg = document.getElementById('bookingSuccess');
    const resetBtn = document.getElementById('btnResetBooking');
    const waxSeal = document.getElementById('waxSeal');
    const successDetails = document.getElementById('successDetails');

    if (!bookingForm || !successMsg || !resetBtn || !waxSeal || !successDetails) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('bookingName').value;
        const dateRaw = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;

        // Format Date to a cleaner representation (e.g. DD/MM/YYYY)
        let dateFormatted = dateRaw;
        if (dateRaw) {
            const parts = dateRaw.split('-');
            if (parts.length === 3) {
                dateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }

        // Build the receipt html
        successDetails.innerHTML = `
            <strong>Reservation Details:</strong><br>
            Name: <strong>${name}</strong><br>
            Date: <strong>${dateFormatted}</strong><br>
            Time: <strong>${time}</strong><br>
            Guests: <strong>${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}</strong>
        `;

        // Display the success screen
        successMsg.style.display = 'flex';
        successMsg.style.opacity = '0';
        
        // Trigger reflow
        successMsg.offsetHeight;
        successMsg.style.opacity = '1';

        // Animate the Wax Seal drop
        setTimeout(() => {
            waxSeal.classList.add('stamped');
        }, 150);
    });

    // Reset reservation card to booking form
    resetBtn.addEventListener('click', () => {
        // Clear inputs
        document.getElementById('bookingName').value = '';
        document.getElementById('bookingDate').value = '';
        document.getElementById('bookingTime').selectedIndex = 0;
        
        // Reset guest count
        guestCount = 2;
        document.getElementById('guestCountDisplay').textContent = guestCount;

        // Hide success message
        successMsg.style.opacity = '0';
        waxSeal.classList.remove('stamped');

        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 400);
    });
}

/* 4. Menu Section Carousels (Food & Beverages) */
function initMenuCarousels() {
    const carousels = ['foodCarousel', 'beverageCarousel'];
    
    carousels.forEach(carouselId => {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const track = carousel.querySelector('.carousel-track');
        const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
        const dots = Array.from(carousel.querySelectorAll('.dot'));
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        
        if (cards.length === 0) return;
        
        let currentIndex = 0;
        let slideInterval;
        const intervalTime = 5000; // 5 seconds
        
        // Show specific card and assign stack classes
        function showCard(index) {
            // Handle wrap-around index
            if (index >= cards.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = cards.length - 1;
            } else {
                currentIndex = index;
            }
            
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            const nextIndex = (currentIndex + 1) % cards.length;
            
            // Assign active, prev, and next classes
            cards.forEach((card, idx) => {
                card.classList.remove('active', 'prev', 'next');
                if (idx === currentIndex) {
                    card.classList.add('active');
                } else if (idx === prevIndex) {
                    card.classList.add('prev');
                } else if (idx === nextIndex) {
                    card.classList.add('next');
                }
            });
            
            // Toggle active state for pagination dots
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
        
        // Start auto play
        function startAutoPlay() {
            stopAutoPlay();
            slideInterval = setInterval(() => {
                showCard(currentIndex + 1);
            }, intervalTime);
        }
        
        // Stop auto play
        function stopAutoPlay() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }
        
        // Manual navigation button handlers
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showCard(currentIndex + 1);
                startAutoPlay(); // Reset timer
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showCard(currentIndex - 1);
                startAutoPlay(); // Reset timer
            });
        }
        
        // Dot indicator click handlers
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetIndex = parseInt(dot.getAttribute('data-slide'));
                showCard(targetIndex);
                startAutoPlay(); // Reset timer
            });
        });
        
        // Click directly on peeking cards to transition
        cards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                if (card.classList.contains('prev')) {
                    showCard(currentIndex - 1);
                    startAutoPlay();
                } else if (card.classList.contains('next')) {
                    showCard(currentIndex + 1);
                    startAutoPlay();
                }
            });
        });
        
        // Pause auto play on hover over active area
        carousel.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        // Support swipe gestures on mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 40; // swipe threshold in px
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    showCard(currentIndex + 1);
                } else {
                    showCard(currentIndex - 1);
                }
            }
        }
        
        // Initialize carousel classes and auto-swiping
        showCard(0);
        startAutoPlay();
    });
}
