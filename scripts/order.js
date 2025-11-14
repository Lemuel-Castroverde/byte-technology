/**
 * scripts/order.js
 * Handles rendering the cart contents, updating quantities, removing items, 
 * AND now handles the checkout button click to enforce login.
 */
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartSummaryEl = document.getElementById('cart-summary');
    const emptyCartMessageEl = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Main Cart Renderer ---
    function renderCart() {
        // ... (this function is unchanged) ...
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartSummaryEl.style.display = 'none';
            emptyCartMessageEl.style.display = 'block';
            cartTotalEl.textContent = '0.00';
        } else {
            cartSummaryEl.style.display = 'block';
            emptyCartMessageEl.style.display = 'none';
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                const cartItem = document.createElement('div');
                cartItem.className = 'col-lg-10 mb-3';
                cartItem.innerHTML = `
                    <div class="card bg-dark text-light shadow-lg p-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
                        <div class="d-flex align-items-center text-center text-md-start flex-grow-1 gap-3">
                            <img src="${item.img}" alt="${item.name}" class="rounded" style="width:100px; height:100px; object-fit:cover;">
                            <div>
                                <h5 class="mb-1 text-warning">${item.name}</h5>
                                <p class="mb-0">₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} each</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end gap-2 flex-wrap mt-3 mt-md-0 ms-md-3">
                            <div class="d-flex align-items-center">
                                <button class="btn btn-outline-light btn-sm minus" data-index="${index}">-</button>
                                <span class="mx-2 fw-bold" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                                <button class="btn btn-outline-light btn-sm plus" data-index="${index}">+</button>
                            </div>
                            <button class="btn btn-danger btn-sm ms-2 remove-btn" data-index="${index}">Remove</button>
                        </div>
                    </div>`;
                cartItemsContainer.appendChild(cartItem);
            });
            cartTotalEl.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2 });
        }
        window.updateCartCount();
        window.updateCartPreview();
    }

    // --- Item Removal Animation/Logic ---
    function removeItem(index) {
        // ... (this function is unchanged) ...
        const card = cartItemsContainer.children[index];
        if (card) {
            card.classList.add('removing');
            setTimeout(() => {
                cart.splice(index, 1);
                updateCart();
            }, 400);
        }
    }

    // --- Update Local Storage & Re-render ---
    function updateCart() {
        // ... (this function is unchanged) ...
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // --- Event Listener for Quantity Changes/Removals ---
    cartItemsContainer.addEventListener('click', (e) => {
        // ... (this function is unchanged) ...
        const index = e.target.dataset.index;
        if (index === undefined) return;
        let needsUiUpdate = true;
        if (e.target.classList.contains('plus')) {
            cart[index].quantity++;
        } else if (e.target.classList.contains('minus')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                removeItem(index);
                needsUiUpdate = false; 
            }
        } else if (e.target.classList.contains('remove-btn')) {
            removeItem(index);
            needsUiUpdate = false; 
        }
        if (needsUiUpdate) {
            updateCart();
        }
    });

    // --- UPDATED: CHECKOUT BUTTON LISTENER ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link

            fetch('php/check_session.php')
                .then(res => res.json())
                .then(data => {
                    if (data.loggedin) {
                        // User is logged in, proceed to checkout
                        window.location.href = 'checkout.html';
                    } else {
                        // User is NOT logged in.
                        // 1. Set a flag to remember they want to check out
                        sessionStorage.setItem('pendingCheckout', 'true');
                        
                        // 2. Show the login modal
                        alert("You must be logged in to proceed to checkout.");
                        const loginModalEl = document.getElementById('loginModal');
                        if (loginModalEl) {
                            const loginModal = new bootstrap.Modal(loginModalEl);
                            loginModal.show();
                        }
                    }
                });
        });
    }

    // Initial render on page load
    renderCart();
});