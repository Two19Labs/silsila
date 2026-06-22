/* --------------------------------------------------
   SILSILA INTERACTIVE SCRIPT
   Interactive booking form, guest counter, and scroll effects.
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initGuestCounter();
    initBookingForm();
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
