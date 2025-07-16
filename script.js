
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tour-tab');
    const tourCards = document.querySelectorAll('.tour-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));

            this.classList.add('active');

            const selectedFilter = this.getAttribute('data-tab');

            filterTours(selectedFilter);
        });
    });

    function filterTours(filter) {
        tourCards.forEach(card => {
            const tourType = card.getAttribute('data-tour-type');

            if (filter === 'all' || tourType === filter) {
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
    const originalText = submitBtn.textContent;

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
            window.location.href = 'https://yourdomain.com/thank-you.html';
        } else {
            alert('There was an error sending your message. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert('There was an error sending your message. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('click', function () {
        const btn = this.querySelector('.contact-method-btn');
        if (btn) {
            btn.click();
        }
    });
});