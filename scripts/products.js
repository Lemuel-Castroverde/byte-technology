/**
 * Handles product data fetching, grid rendering, and 'Add to Cart' listeners 
 * NOTE: It relies on window.showPopup(), window.updateCartCount(), etc., 
 */
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    
    // 1. Fetch products and render the grid
    fetch('php/public_get_products.php')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.products.length > 0) {
                productGrid.innerHTML = ''; 
                data.products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    
                    // Use product.id to link to the details page correctly
                    const detailLink = `details.html?id=${product.id}`;
                    
                    productCard.innerHTML = `
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <div class="product-overlay">
                            <p>${product.description}</p>
                            <p class="fw-bold text-warning">₱${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <div>
                                <button class="btn btn-custom add-to-cart" data-id="${product.id}">Add to Cart</button>
                                <a href="${detailLink}" class="btn btn-custom">View Details</a>
                            </div>
                        </div>
                    `;
                    productGrid.appendChild(productCard);
                });
                initializeCartButtons(data.products);
            } else {
                productGrid.innerHTML = '<p class="text-light">No products are available at this time.</p>';
            }
        });
    
    // 2. Add to Cart Logic
    function initializeCartButtons(products) {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const product = products.find(p => p.id == productId); // Use == for comparison

                if (!product) return;
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(item => item.id == productId); // Use ID for finding

                if (existing) existing.quantity++;
                else cart.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: parseFloat(product.price), 
                    img: product.image_url, 
                    quantity: 1 
                });
                
                localStorage.setItem('cart', JSON.stringify(cart));

                // CALL EXTERNAL FUNCTIONS (Defined in scripts/cart.js)
                window.showPopup();
                window.updateCartCount();
                window.updateCartPreview();
            });
        });
    }
});