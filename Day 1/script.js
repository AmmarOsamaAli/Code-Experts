// Navbar Behavior
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove background on scroll
    if (currentScroll > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
    
    // Hide/show navbar on scroll up/down
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuButton.classList.toggle('active');
});

// Dropdown Menu
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent default only for the dropdown toggle
        e.preventDefault();

        const parent = this.parentElement;
        parent.classList.toggle('active');
    });
});

// Scroll Animation for How It Works section
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Start observing the How It Works section
document.addEventListener('DOMContentLoaded', () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
        observer.observe(howItWorksSection);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Collect form data
            const formData = {
                fields: {
                    Name: contactForm.name.value,
                    Email: contactForm.email.value,
                    Phone: contactForm.phone.value,
                    Subject: contactForm.subject.value,
                    Message: contactForm.message.value,
                    "Submission Date": new Date().toISOString()
                }
            };

            try {
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to submit form');
                }

                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();

            } catch (error) {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
} 