// assets/js/contact-us.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Clear previous messages
            formMessage.classList.add('hidden');
            formMessage.classList.remove('success', 'error');
            formMessage.textContent = '';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic client-side validation
            if (!name || !email || !subject || !message) {
                displayFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                displayFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // --- Simulation of form submission ---
            console.log("Form submitted (simulated):", { name, email, subject, message });

            // In a real application, you would send this data to a backend server:
            /*
            fetch('/api/contact', { // Replace with your actual backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset(); // Clear form fields on success
            })
            .catch(error => {
                console.error('Form submission error:', error);
                displayFormMessage('There was an error sending your message. Please try again later.', 'error');
            });
            */

            // Simulate success for frontend demo
            setTimeout(() => {
                displayFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset(); // Clear form fields
            }, 1000); // Simulate network delay
        });
    }

    function isValidEmail(email) {
        // Simple regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function displayFormMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.classList.remove('hidden');
        formMessage.classList.add(type);
    }

    // You don't need to re-handle nav active states here, main.js does that.
});