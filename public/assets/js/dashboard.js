// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Features Grid Animation on Scroll ---
    const featuresGrid = document.querySelector('.features-grid');

    if (featuresGrid) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When the features grid comes into view, add the animation class
                    entry.target.classList.add('animate-features');
                    // Stop observing once it has animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Options for the observer
            threshold: 0.2, // Trigger when 20% of the element is visible
            rootMargin: "0px" // No extra margin around the viewport
        });

        // Start observing the features grid
        observer.observe(featuresGrid);
    }
});