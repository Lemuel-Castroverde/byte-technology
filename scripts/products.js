/**
 * scripts/products.js
 * Handles fetching Products AND Services.
 */
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const servicesGrid = document.getElementById('services-grid'); // <--- New Reference
    const searchInput = document.getElementById('search-input');
    
    let allProducts = []; 

    // 1. Fetch PRODUCTS
    fetch('php/public_get_products.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                allProducts = data.products;
                renderProducts(allProducts);
            } else {
                if(productGrid) productGrid.innerHTML = '<p class="text-light">Failed to load products.</p>';
            }
        })
        .catch(err => console.error(err));

    // 2. Fetch SERVICES (New Logic)
    if (servicesGrid) {
        fetch('php/get_services.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderServices(data.services);
                } else {
                    servicesGrid.innerHTML = '<p class="text-light">Failed to load services.</p>';
                }
            })
            .catch(err => console.error(err));
    }

    // --- Search Logic (For Products) ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredProducts = allProducts.filter(product => {
                return product.name.toLowerCase().includes(searchTerm) || 
                       product.description.toLowerCase().includes(searchTerm) ||
                       (product.components && product.components.toLowerCase().includes(searchTerm));
            });
            renderProducts(filteredProducts);
        });
    }

    // --- Render Functions ---

    function renderProducts(products) {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        if (products.length === 0) {
            productGrid.innerHTML = '<p class="text-light fs-5 mt-4">No products found matching your search.</p>';
            return;
        }

        products.forEach(product => {
            const detailLink = `details.html?id=${product.id}`;
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="product-overlay">
                    <p class="small">${product.description.substring(0, 100)}...</p>
                    <p class="fw-bold text-warning fs-5">₱${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div>
                        <button class="btn btn-custom add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <a href="${detailLink}" class="btn btn-custom">View Details</a>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        initializeCartButtons(products);
    }

    function renderServices(services) {
        servicesGrid.innerHTML = '';
        if (services.length === 0) {
            servicesGrid.innerHTML = '<p class="text-light">No services available.</p>';
            return;
        }

        services.forEach(service => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-3';
            col.innerHTML = `
                <div class="about-card h-100 p-4 rounded shadow-sm position-relative" style="background: rgba(255, 255, 255, 0.1);">
                    <h4 class="fw-bold text-warning mb-3">${service.name}</h4>
                    <p class="text-light mb-4">${service.description}</p>
                    <div class="mt-auto border-top border-secondary pt-3">
                        <span class="text-warning fw-bold fs-5">Starts at ₱${parseFloat(service.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            `;
            servicesGrid.appendChild(col);
        });
    }

    function initializeCartButtons(currentProductList) {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const product = currentProductList.find(p => p.id == productId);
                if (!product) return;
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(item => item.id == productId);
                if (existing) existing.quantity++;
                else cart.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: parseFloat(product.price), 
                    img: product.image_url, 
                    quantity: 1 
                });
                
                localStorage.setItem('cart', JSON.stringify(cart));
                if (window.showPopup) window.showPopup();
                if (window.updateCartCount) window.updateCartCount();
                if (window.updateCartPreview) window.updateCartPreview();
            });
        });
    }
});