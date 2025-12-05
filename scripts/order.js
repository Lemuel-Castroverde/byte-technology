/**
 * scripts/order.js
 * Render Server-Side Cart
 */
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartSummaryEl = document.getElementById('cart-summary');
    const emptyCartMessageEl = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Load Cart
    function loadCart() {
        window.fetchCart((cart) => {
            renderCartHTML(cart);
        });
    }

    function renderCartHTML(cart) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartSummaryEl.style.display = 'none';
            emptyCartMessageEl.style.display = 'block';
            cartTotalEl.textContent = '0.00';
            return;
        }

        cartSummaryEl.style.display = 'block';
        emptyCartMessageEl.style.display = 'none';

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const div = document.createElement('div');
            div.className = 'col-lg-10 mb-3';
            div.innerHTML = `
                <div class="card bg-dark text-light shadow-lg p-3 d-flex flex-row align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image_url}" class="rounded" style="width:80px; height:80px; object-fit:cover;">
                        <div>
                            <h5 class="mb-0 text-warning">${item.name}</h5>
                            <small>₱${parseFloat(item.price).toLocaleString()}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-light action-btn" data-action="decrease" data-id="${item.cart_id}">-</button>
                        <span class="fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-light action-btn" data-action="increase" data-id="${item.cart_id}">+</button>
                        <button class="btn btn-sm btn-danger action-btn" data-action="remove" data-id="${item.cart_id}">×</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
        cartTotalEl.textContent = total.toLocaleString(undefined, {minimumFractionDigits: 2});
    }

    // Handle Actions (+, -, Remove)
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn')) {
            const action = e.target.dataset.action;
            const cartId = e.target.dataset.id;
            
            fetch('php/update_cart.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ cart_id: cartId, action: action })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) loadCart(); // Re-render
            });
        }
    });

    // Handle Checkout Click
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }

    loadCart();
});