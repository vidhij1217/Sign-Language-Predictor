// assets/js/learn-signs.js

document.addEventListener('DOMContentLoaded', () => {
    const signSearchInput = document.getElementById('signSearchInput');
    const signCategoryFilter = document.getElementById('signCategoryFilter');
    const signsGrid = document.getElementById('signsGrid');
    const noSignsFound = document.getElementById('noSignsFound');
    const allSignCards = document.querySelectorAll('.sign-card'); // Get all cards initially

    // Function to filter and display signs
    function filterSigns() {
        const searchTerm = signSearchInput.value.toLowerCase().trim();
        const selectedCategory = signCategoryFilter.value;

        let visibleSignsCount = 0;

        allSignCards.forEach(card => {
            const signName = card.querySelector('.sign-title').textContent.toLowerCase();
            const signDescription = card.querySelector('.sign-description').textContent.toLowerCase();
            const signCategory = card.dataset.category; // Get category from data-attribute

            const matchesSearch = searchTerm === '' ||
                                  signName.includes(searchTerm) ||
                                  signDescription.includes(searchTerm);

            const matchesCategory = selectedCategory === 'all' || signCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex'; // Show the card (flex because it's a flex container)
                visibleSignsCount++;
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });

        // Show/hide "No Signs Found" message
        if (visibleSignsCount === 0) {
            noSignsFound.classList.remove('hidden');
        } else {
            noSignsFound.classList.add('hidden');
        }
    }

    // Event listeners for filtering
    signSearchInput.addEventListener('input', filterSigns);
    signCategoryFilter.addEventListener('change', filterSigns);

    // Event listener for "Practice This Sign" buttons (placeholder)
    signsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('practice-btn')) {
            const signTitle = event.target.closest('.sign-card').querySelector('.sign-title').textContent;
            alert(`You clicked "Practice This Sign" for: "${signTitle}". (Functionality coming soon!)`);
            // Here you would typically navigate to a dedicated practice page or open a modal
        }
    });

    // Initial filter when the page loads (to ensure visibility based on initial state)
    filterSigns();
});