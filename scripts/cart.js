/**
 * scripts/cart.js
 * Manages Server-Side Cart interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Global References ---
    const cartCount = document.getElementById('cart-count');
    const previewList = document.getElementById('cart-preview-items');
    const cartPopup = document.getElementById('cart-popup');

    // --- Exposed Global Functions ---

    // 1. Fetch Cart Data from Server
    window.fetchCart = function(callback) {
        fetch('php/get_cart.php')
            .then(res => res.json())
            .then(data => {
                const cart = data.cart || [];
                updateHeaderUI(cart);
                if (callback) callback(cart);
            })
            .catch(err => console.error("Cart fetch error:", err));
    };

    // 2. Add Item to Cart (Called by Products/Details page)
    window.addToCartDB = function(productId, quantity = 1) {
        fetch('php/add_to_cart.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ product_id: productId, quantity: quantity })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showPopup('Added to Cart!');
                window.fetchCart(); // Refresh UI
            } else {
                // If not logged in or other error
                alert(data.message);
                if (data.message.includes('login')) {
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                }
            }
        });
    };

    // --- Internal Helpers ---

    function updateHeaderUI(cart) {
        // Update Badge Count
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update Preview Dropdown
        if (previewList) {
            previewList.innerHTML = cart.length ? "" : "<li class='text-center p-2'>Cart is empty</li>";
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'd-flex justify-content-between px-2 py-1';
                li.innerHTML = `<span class="text-truncate" style="max-width: 150px;">${item.name}</span> <span class="text-warning">x${item.quantity}</span>`;
                previewList.appendChild(li);
            });
        }
    }

    function showPopup(msg) {
        if (cartPopup) {
            cartPopup.textContent = msg;
            cartPopup.classList.add('show');
            setTimeout(() => cartPopup.classList.remove('show'), 1500);
        }
    }

    // Initial Load
    window.fetchCart();
});