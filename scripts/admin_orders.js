/**
 * scripts/admin_orders.js
 * Fetches and displays order data for the admin_orders.php page.
 * Allows Admins to change Order Status.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('orders-table-body');
    const messageContainer = document.getElementById('message-container'); // Ensure this exists in admin_orders.php

    // 1. Fetch Orders
    function fetchOrders() {
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
    }

    // 2. Render Table with Status Dropdown
    function renderOrders(orders) {
        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No orders found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');

            const orderDate = new Date(order.order_date).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const totalAmount = parseFloat(order.total_amount).toLocaleString('en-US', {
                style: 'currency', currency: 'PHP'
            });

            // Status Dropdown Logic
            const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
            let optionsHtml = '';
            statuses.forEach(status => {
                const isSelected = (order.status === status) ? 'selected' : '';
                optionsHtml += `<option value="${status}" ${isSelected}>${status}</option>`;
            });

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.full_name}</td>
                <td>${orderDate}</td>
                <td><small>${order.items_summary || 'N/A'}</small></td>
                <td>${totalAmount}</td>
                <td>
                    <select class="form-select form-select-sm bg-dark text-white border-secondary status-select" data-id="${order.id}">
                        ${optionsHtml}
                    </select>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 3. Handle Status Change
    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            updateOrderStatus(orderId, newStatus);
        }
    });

    function updateOrderStatus(orderId, newStatus) {
        fetch('php/update_order_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: newStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage(data.message, true);
                // Optional: Re-fetch orders if you want to refresh data
                // fetchOrders(); 
            } else {
                showMessage(data.message, false);
                fetchOrders(); // Revert changes on error
            }
        })
        .catch(err => {
            console.error(err);
            showMessage('Connection error.', false);
        });
    }

    // Helper: Show Alert Message
    function showMessage(message, isSuccess) {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${message}</div>`;
            setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
        } else {
            alert(message);
        }
    }

    // Initial Load
    fetchOrders();
});