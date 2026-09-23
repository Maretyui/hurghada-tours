
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('nav-menu-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Closing on link click matters here specifically because every nav
        // link is an in-page anchor (#tours etc.) rather than a real
        // navigation - without this the open dropdown would just stay open,
        // covering the section it was supposed to scroll to.
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('nav-menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // The toggle button is the only other way to close the menu -
        // keyboard users had no way to dismiss it without tabbing all the
        // way through every nav link first.
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('nav-menu-open')) {
                navMenu.classList.remove('nav-menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    const tabs = document.querySelectorAll('.tour-tab');
    const tourCards = document.querySelectorAll('.tour-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });

            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            const selectedFilter = this.getAttribute('data-tab');

            filterTours(selectedFilter);
        });
    });

    function filterTours(filter) {
        let visibleCount = 0;

        tourCards.forEach(card => {
            const tourType = card.getAttribute('data-tour-type');

            if (filter === 'all' || tourType === filter) {
                visibleCount++;
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 50);
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });

        const status = document.getElementById('tour-filter-status');
        if (status) {
            status.textContent = `Showing ${visibleCount} tour${visibleCount === 1 ? '' : 's'}.`;
        }
    }
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};




document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    // innerHTML, not textContent - the button's default state has a
    // decorative <span aria-hidden="true"> wrapping the ✈️ icon so screen
    // readers skip it. Restoring via textContent would flatten that back
    // into plain text, permanently losing the aria-hidden wrapper the first
    // time the form gets submitted.
    const originalHTML = submitBtn.innerHTML;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(this);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // No dedicated thank-you page exists in this repo yet, so confirm
            // success in place instead of redirecting to a URL that would 404.
            submitBtn.textContent = 'Message Sent!';
            this.reset();
            // Without this, the button stayed disabled with "Message Sent!"
            // forever, so a visitor who wanted to send a second message had
            // no way to re-enable the form short of reloading the page.
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 3000);
        } else {
            alert('There was an error sending your message. Please try again.');
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert('There was an error sending your message. Please try again.');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }
});

document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('click', function (e) {
        const btn = this.querySelector('.contact-method-btn');
        // btn.click() dispatches a real click event that bubbles right back up
        // to this same listener - without this guard, a click landing on (or
        // inside) the link itself re-triggers btn.click() over and over until
        // the call stack overflows, instead of just letting the link's own
        // native click do its job.
        if (btn && !e.target.closest('.contact-method-btn')) {
            btn.click();
        }
    });
});