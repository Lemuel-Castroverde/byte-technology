/**
 * scripts/admin_dashboard.js
 * Fetches live statistics from the server and updates the admin dashboard cards.
 */
document.addEventListener('DOMContentLoaded', () => {
    // References to the HTML elements in admin.php
    const salesEl = document.getElementById('total-sales');
    const ordersEl = document.getElementById('total-orders');
    const productsEl = document.getElementById('total-products');
    const usersEl = document.getElementById('total-users');

    fetch('php/get_dashboard_stats.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 1. Update Sales (Format as Currency)
                if (salesEl) {
                    salesEl.textContent = '₱' + parseFloat(data.sales).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }

                // 2. Update Counts
                if (ordersEl) ordersEl.textContent = data.orders;
                if (productsEl) productsEl.textContent = data.products;
                if (usersEl) usersEl.textContent = data.users;
            } else {
                console.error("Failed to fetch dashboard stats:", data.message);
            }
        })
        .catch(err => {
            console.error("Network error fetching stats:", err);
        });
});