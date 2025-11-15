/**
 * scripts/admin_products.js
 * Fetches and displays product data for the admin_products.php page.
 * Handles product deletions.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('products-table-body');
    const messageContainer = document.getElementById('message-container');

    // Function to fetch and render products
    function fetchProducts() {
        fetch('php/get_products.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderProducts(data.products);
                } else {
                    showMessage(data.message, false);
                    tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                showMessage('Failed to load products.', false);
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load products.</td></tr>`;
            });
    }

    // Function to render the product table
    function renderProducts(products) {
        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No products found. Add one!</td></tr>`;
            return;
        }

        tableBody.innerHTML = ''; // Clear "Loading..."
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image_url}" alt="${product.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px;"></td>
                <td>${product.name}</td>
                <td>₱${parseFloat(product.price).toLocaleString()}</td>
                <td class="text-end">
                    <a href="admin_edit_product.php?id=${product.id}" class="btn btn-warning btn-sm">Edit</a>
                    <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}" data-name="${product.name}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Event listener for delete buttons
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-product')) {
            const productId = e.target.dataset.id;
            const productName = e.target.dataset.name;
            if (confirm(`Are you sure you want to delete product: ${productName}?`)) {
                deleteProduct(productId);
            }
        }
    });

    // --- Action Functions ---

    function deleteProduct(productId) {
        fetch('php/delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                fetchProducts(); // Refresh the table
            }
        });
    }
    
    // Helper to show messages
    function showMessage(message, isSuccess) {
        messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${message}</div>`;
        setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
    }

    // Initial fetch on page load
    fetchProducts();
});