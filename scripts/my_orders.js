/**
 * scripts/my_orders.js
 * Fetches and displays the order history for the logged-in user.
 * Handles status color coding and empty state rendering.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('my-orders-table-body');

    // 1. Initial Session Check
    // We verify the user is logged in before fetching their personal data.
    fetch('php/check_session.php')
        .then(res => res.json())
        .then(sessionData => {
            if (!sessionData.loggedin) {
                // If not logged in, redirect to home page immediately
                window.location.href = 'index.html';
                return;
            }
            // User is valid, proceed to fetch data
            fetchUserOrders();
        });

    // 2. Fetch User Orders
    function fetchUserOrders() {
        fetch('php/get_user_orders.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderOrders(data.orders);
                } else {
                    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${data.message || 'Error loading orders.'}</td></tr>`;
                }
            })
            .catch(err => {
                console.error('Error fetching orders:', err);
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to connect to server.</td></tr>`;
            });
    }

    // 3. Render Table Rows
    function renderOrders(orders) {
        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">You have no orders yet.</td></tr>`;
            return;
        }

        tableBody.innerHTML = ''; // Clear loading message

        orders.forEach(order => {
            const row = document.createElement('tr');
            
            // Format Date (e.g., 12/04/2025 02:30 PM)
            const dateObj = new Date(order.order_date);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // Format Amount (e.g., ₱1,500.00)
            const total = parseFloat(order.total_amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Determine Status Color
            let statusColor = 'text-white';
            switch(order.status) {
                case 'Pending':    statusColor = 'text-warning'; break;
                case 'Processing': statusColor = 'text-info'; break;
                case 'Shipped':    statusColor = 'text-primary'; break;
                case 'Delivered':  statusColor = 'text-success'; break;
                case 'Cancelled':  statusColor = 'text-danger'; break;
            }

            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${dateStr}</td>
                <td>₱${total}</td>
                <td class="text-capitalize">${order.payment_method}</td>
                <td class="fw-bold ${statusColor}">${order.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});