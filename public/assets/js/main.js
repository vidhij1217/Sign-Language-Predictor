// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Toggle (Hamburger Menu) ---
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNavigation = document.getElementById('primary-navigation');

    if (navToggle && primaryNavigation) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            // The CSS uses aria-expanded to show/hide the nav-list
        });

        // Close the nav menu if a link is clicked (for smoother mobile experience)
        primaryNavigation.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle.getAttribute('aria-expanded') === 'true') {
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Active Navigation Link Highlighting ---
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list .nav-link');

    navLinks.forEach(link => {
        // Get the href relative to the root (e.g., "/chatbot", "/index")
        const linkHref = link.getAttribute('href');

        // Special handling for the root path '/' and '/index'
        if (currentPath === '/' && linkHref === '/') {
            link.classList.add('active');
        }
        // General case: Check if current path starts with the link's path
        // This is useful for future dynamic routes (e.g., /learn-signs/123 should activate /learn-signs)
        else if (linkHref !== '/' && currentPath.startsWith(linkHref)) {
            link.classList.add('active');
        }
    });
});