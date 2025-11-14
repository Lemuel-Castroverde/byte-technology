/**
 * Centralized cart utilities shared across e-commerce pages.
 * It handles the cart count display, preview hover logic, and the confirmation pop-up.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Element References (Shared Cart UI) ---
    const cartPopup = document.getElementById('cart-popup');
    const cartCount = document.getElementById('cart-count');
    const previewList = document.getElementById('cart-preview-items');
    const cartContainer = document.getElementById('cart-container');
    const cartPreview = document.getElementById('cart-preview');

    // --- Cart Utility Functions (Exposed to the window for use by page-specific scripts) ---

    // 1. Show the "Added to Cart!" pop-up
    window.showPopup = function() {
        if (cartPopup) {
            cartPopup.classList.add('show');
            setTimeout(() => cartPopup.classList.remove('show'), 1200);
        }
    }

    // 2. Update the main cart item count in the header
    window.updateCartCount = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartCount) {
            // Sum of all item quantities
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // 3. Update the cart preview dropdown content
    window.updateCartPreview = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (previewList) {
            previewList.innerHTML = cart.length ? "" : "<li>No items in cart</li>";
            cart.forEach(item => {
                previewList.appendChild(document.createElement('li')).textContent = `${item.name} × ${item.quantity}`;
            });
        }
    }
    
    // --- Initializers and Event Listeners ---

    // Show/hide cart preview on hover
    if (cartContainer && cartPreview) {
        // Ensures the preview shows when the cart button/container is hovered
        cartContainer.addEventListener('mouseenter', () => cartPreview.classList.add('show'));
        cartContainer.addEventListener('mouseleave', () => cartPreview.classList.remove('show'));
    }

    // Run initial updates for any page load
    updateCartCount();
    updateCartPreview();
});