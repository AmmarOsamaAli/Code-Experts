document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const AIRTABLE_ENDPOINT = 'https://api.airtable.com/v0/YOUR_BASE_ID/Contacts'; // Replace with your Airtable base ID
    
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
                const response = await fetch(AIRTABLE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_AIRTABLE_API_KEY' // Replace with your Airtable API key
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
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