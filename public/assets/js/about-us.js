// assets/js/about-us.js

document.addEventListener('DOMContentLoaded', () => {
    // This page is primarily static content, so less interactive JS is needed here.
    // However, if you add features like:
    // - accordions for FAQs
    // - a carousel for team members
    // - an animation for sections as they scroll into view
    // ...you would add that logic here.

    console.log("About Us page loaded.");

    // Example: Simple scroll animation (optional)
    const sections = document.querySelectorAll('.our-story, .our-vision, .our-team');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        sectionObserver.observe(section);
    });

    // You don't need to re-handle nav active states here, main.js does that.
});