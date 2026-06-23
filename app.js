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
        const controls = document.querySelector(`.carousel-controls[data-carousel="${carouselId}"]`);
        if (!controls) return;
        
        const dots = Array.from(controls.querySelectorAll('.dot'));
        const prevBtn = controls.querySelector('.prev-btn');
        const nextBtn = controls.querySelector('.next-btn');
        
        let currentIndex = 0;
        let slideInterval;
        const intervalTime = 5000; // 5 seconds
        
        // Show specific card
        function showCard(index) {
            // Remove active classes
            cards.forEach(card => card.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Handle wrap-around index
            if (index >= cards.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = cards.length - 1;
            } else {
                currentIndex = index;
            }
            
            // Set active class
            cards[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
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
        
        // Manual control handlers
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showCard(currentIndex + 1);
                startAutoPlay(); // Reset timer
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showCard(currentIndex - 1);
                startAutoPlay(); // Reset timer
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-slide'));
                showCard(targetIndex);
                startAutoPlay(); // Reset timer
            });
        });
        
        // Pause on hover
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
            const threshold = 50; // min swipe distance in px
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swiped left, show next card
                    showCard(currentIndex + 1);
                } else {
                    // Swiped right, show prev card
                    showCard(currentIndex - 1);
                }
            }
        }
        
        // Initialize
        startAutoPlay();
    });
}
