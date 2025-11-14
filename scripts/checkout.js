/**
 * scripts/checkout.js
 * "Firewall" script. Hides content, enforces login, and autofills user data.
 * If user is not logged in, they are redirected back to the order page.
 */
document.addEventListener('DOMContentLoaded', () => {
    const summaryList = document.getElementById('summary-items-list');
    const summaryTotal = document.getElementById('summary-total');
    const summaryCount = document.getElementById('summary-item-count');
    const checkoutForm = document.getElementById('checkoutForm');
    const submitButton = document.querySelector('#checkoutForm button[type="submit"]');
    const mainContent = document.getElementById('checkout-main-content'); // Get the main content

    // 1. --- EMPTY CART CHECK (Priority 1) ---
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0 && window.location.pathname.endsWith('checkout.html')) {
        alert("Your cart is empty. Redirecting to products page.");
        window.location.href = 'prodserv.html';
        return; // Stop all other execution
    }

    // 2. --- SECURITY CHECK (Priority 2) ---
    fetch('php/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedin) {
                // User is NOT logged in. Redirect them away.
                alert("You must be logged in to view this page.");
                window.location.href = 'order.html'; // Send back to cart/order page
            } else {
                // User IS logged in. Autofill the form.
                const nameField = document.getElementById('fullName');
                const emailField = document.getElementById('email');

                if (nameField && data.userName) nameField.value = data.userName;
                if (emailField && data.email) emailField.value = data.email;

                // Now, show the main content and render the cart.
                if (mainContent) mainContent.style.display = 'block';
                renderSummary(); // Call this only AFTER we know they are logged in.
            }
        });
    
    // --- Render Final Cart Summary ---
    function renderSummary() {
        // ... (this function is unchanged) ...
        summaryList.innerHTML = '';
        let total = 0, itemCount = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            itemCount += item.quantity;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between lh-sm bg-dark text-light';
            li.innerHTML = `<div><h6 class="my-0 text-warning">${item.name}</h6><small class="text-light">Quantity: ${item.quantity}</small></div><span class="text-light">₱${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
            summaryList.appendChild(li);
        });
        summaryTotal.textContent = `₱${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        summaryCount.textContent = itemCount;
    }

    // --- Checkout Form Submission Handler ---
    if(checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            // ... (this function is unchanged) ...
            e.preventDefault();
            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }
            submitButton.disabled = true;
            submitButton.textContent = 'Placing Order...';
            const orderData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                contactNumber: document.getElementById('contactNumber').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').id,
                cart: cart
            };
            fetch('php/submit_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Thank you for your order! It has been placed successfully.');
                    localStorage.removeItem('cart'); 
                    window.updateCartCount(); 
                    window.updateCartPreview();
                    window.location.href = 'index.html';
                } else {
                    alert('Error: ' + data.message);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Place Order';
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('An unexpected error occurred.');
                submitButton.disabled = false;
                submitButton.textContent = 'Place Order';
            });
        });
    }
});