/**
 * scripts/details.js
 * Handles fetching and rendering a single product's details.
 * UPDATED: Uses server-side cart (window.addToCartDB) instead of localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        detailsContainer.innerHTML = '<p class="text-danger text-center lead">No product selected. Please go back to the products page.</p>';
        return;
    }

    // Fetch product details from the server
    fetch(`php/public_get_products.php?id=${productId}`) 
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Find the specific product from the list (or fetch single if endpoint supported it)
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
        // Prepare Component List
        const componentsHtml = product.components 
            ? product.components.split('\n').map(c => `<li>• ${c.trim()}</li>`).join('') 
            : '<li>No components listed.</li>';

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
                        ${componentsHtml}
                    </ul>
                    <p id="product-price" class="fw-bold mt-3">Price: ₱${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div class="mt-4 d-flex flex-wrap gap-3">
                        <button id="addToCartBtn" class="btn btn-warning text-dark fw-bold px-4">Add to Cart</button>
                        <a href="prodserv.html" class="btn btn-outline-light fw-bold px-4">Go Back</a>
                    </div>
                </div>
            </div>
        `;

        // --- UPDATED ADD TO CART LISTENER ---
        const addBtn = document.getElementById('addToCartBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Check if the server-side function exists (from cart.js)
                if (window.addToCartDB) {
                    window.addToCartDB(product.id, 1);
                } else {
                    console.error("addToCartDB function missing! Ensure cart.js is loaded.");
                    alert("System Error: Unable to add to cart.");
                }
            });
        }
    }
});