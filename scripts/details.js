/**
 * scripts/details.js
 * Handles fetching and rendering a single product's details on details.html.
 * It relies on window.showPopup(), window.updateCartCount(), etc., defined in scripts/cart.js.
 */
document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        detailsContainer.innerHTML = '<p class="text-danger text-center lead">No product selected. Please go back to the products page.</p>';
        return;
    }

    // --- DYNAMICALLY LOAD SINGLE PRODUCT DETAILS (Performance Fix) ---
    // NOTE: We assume you will create php/public_get_product.php 
    // which only returns data for the specific ID.
    fetch(`php/public_get_product.php?id=${productId}`) 
        .then(res => res.json())
        .then(data => {
            // Your HTML was set up to expect a list and filter, we adjust the data structure here.
            // For now, we will use the current public_get_products.php logic for stability
            if (data.success) {
                const product = data.products.find(p => p.id == productId);
                if (product) {
                    renderProductDetails(product);
                } else {
                    detailsContainer.innerHTML = '<p class="text-danger text-center lead">Product not found.</p>';
                }
            } else {
                detailsContainer.innerHTML = '<p class="text-danger text-center lead">Could not load product details.</p>';
            }
        });

    function renderProductDetails(product) {
        // This content is copied directly from your original details.html inline script:
        detailsContainer.innerHTML = `
            <div class="row align-items-center justify-content-center">
                <div class="col-lg-5 text-center mb-4">
                    <img id="product-img" src="${product.image_url}" alt="${product.name}" class="img-fluid rounded shadow-lg" style="max-height: 400px; object-fit: cover;">
                </div>
                <div class="col-lg-7">
                    <h2 id="product-name" class="text-warning fw-bold">${product.name}</h2>
                    <p id="product-desc" class="lead mt-3">${product.description}</p>
                    <h4 class="text-warning mt-4">Included Components:</h4>
                    <ul id="product-components" class="list-unstyled fs-5">
                        ${product.components.split('\n').map(c => `<li>• ${c.trim()}</li>`).join('')}
                    </ul>
                    <p id="product-price" class="fw-bold mt-3">Price: ₱${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div class="mt-4 d-flex flex-wrap gap-3">
                        <button id="addToCartBtn" class="btn btn-warning text-dark fw-bold px-4" data-id="${product.id}">Add to Cart</button>
                        <a href="prodserv.html" class="btn btn-outline-light fw-bold px-4">Go Back</a>
                    </div>
                </div>
            </div>
        `;

        // Initialize the "Add to Cart" button for this specific product
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            // We pass the product object directly for simplicity
            addToCart(product);
        });
    }
    
    // --- Page-Specific Add to Cart Function ---
    function addToCart(product) {
        const name = product.name;
        const price = parseFloat(product.price);
        const img = product.image_url;
        const id = product.id; // Crucial for future order tracking

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === id); // Use ID for unique identification

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Call external utility functions from scripts/cart.js
        window.showPopup();
        window.updateCartCount();
        window.updateCartPreview();
    }
});