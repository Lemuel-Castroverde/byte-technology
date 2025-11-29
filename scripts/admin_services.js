/**
 * scripts/admin_services.js
 * Fetches and displays service data matching the Admin Products style.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('services-table-body');
    const messageContainer = document.getElementById('message-container');

    // --- 1. Fetch Services ---
    function fetchServices() {
        // We use the same PHP file that you confirmed works
        fetch('php/get_services.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderServices(data.services);
                } else {
                    // Show error in table and message container
                    tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message || 'Error loading services.'}</td></tr>`;
                    showMessage(data.message || 'Error loading services.', false);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Failed to connect to server.</td></tr>';
            });
    }

    // --- 2. Render Table (Matches Product Table Style) ---
    function renderServices(services) {
        if (!services || services.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No services found. Add one!</td></tr>'; // Updated colspan to 5
            return;
        }

        tableBody.innerHTML = ''; 
        
        services.forEach(service => {
            const row = document.createElement('tr');
            
            const priceFormatted = parseFloat(service.price).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });

            // Added image column below
            row.innerHTML = `
                <td>
                    <img src="${service.image_url}" alt="${service.name}" 
                         style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px;">
                </td>
                <td class="fw-bold text-warning">${service.name}</td>
                <td><small class="text-light">${service.description}</small></td>
                <td>₱${priceFormatted}</td>
                <td class="text-end">
                    <a href="admin_edit_service.php?id=${service.id}" class="btn btn-warning btn-sm">Edit</a>
                    <button class="btn btn-danger btn-sm delete-service" data-id="${service.id}" data-name="${service.name}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- 3. Handle Delete Button Click ---
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-service')) {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            
            if (confirm(`Are you sure you want to delete service: ${name}?`)) {
                deleteService(id);
            }
        }
    });

    // --- 4. Delete Logic ---
    function deleteService(id) {
        fetch('php/delete_service.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                fetchServices(); // Refresh table
            }
        })
        .catch(err => {
            console.error(err);
            showMessage('An error occurred while deleting.', false);
        });
    }

    // --- Helper: Show Success/Error Messages ---
    function showMessage(msg, isSuccess) {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${msg}</div>`;
            // Auto-hide after 3 seconds
            setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
        }
    }

    // Initial Load
    fetchServices();
});