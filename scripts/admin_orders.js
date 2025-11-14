/**
 * scripts/admin_orders.js
 * Fetches and displays order data for the admin_orders.php page.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('orders-table-body');

    fetch('php/get_orders.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderOrders(data.orders);
            } else {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load orders.</td></tr>`;
        });

    function renderOrders(orders) {
        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No orders found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = ''; // Clear "Loading..."
        orders.forEach(order => {
            const row = document.createElement('tr');

            // Format date for better readability
            const orderDate = new Date(order.order_date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Format price
            const totalAmount = parseFloat(order.total_amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP' // Assuming PHP, you can change this
            });

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.full_name}</td>
                <td>${orderDate}</td>
                <td>${order.items_summary || 'N/A'}</td>
                <td>${totalAmount}</td>
                <td>${order.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});