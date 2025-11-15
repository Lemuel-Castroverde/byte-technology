/**
 * scripts/admin_edit_product.js
 * Handles logic for the admin_edit_product.php page.
 * Manages both ADDING a new product and EDITING an existing one.
 */
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const pageTitle = document.getElementById('page-title');
    const submitBtn = document.getElementById('submit-btn');
    const messageContainer = document.getElementById('message-container');
    const imagePreview = document.getElementById('image-preview');
    const imageInput = document.getElementById('image');
    
    // --- Get Form Fields ---
    const productIdInput = document.getElementById('product-id');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const componentsInput = document.getElementById('components');
    
    // Check URL for a product ID to determine mode (Add vs. Edit)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    let isEditMode = (productId !== null);

    if (isEditMode) {
        // --- EDIT MODE ---
        pageTitle.innerHTML = 'Edit <span>Product</span>';
        submitBtn.textContent = 'Update Product';
        
        // Fetch product details and populate the form
        fetch(`php/get_product_details.php?id=${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const p = data.product;
                    productIdInput.value = p.id;
                    nameInput.value = p.name;
                    priceInput.value = p.price;
                    descriptionInput.value = p.description;
                    componentsInput.value = p.components;
                    imagePreview.src = p.image_url;
                } else {
                    showMessage(data.message, false);
                    productForm.innerHTML = '<p class="text-danger">Could not load product.</p>';
                }
            });
    } else {
        // --- ADD MODE ---
        pageTitle.innerHTML = 'Add New <span>Product</span>';
        submitBtn.textContent = 'Save Product';
    }

    // --- Image Preview Handler ---
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // --- Form Submission Handler ---
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        const formData = new FormData(productForm);
        const url = isEditMode ? 'php/update_product.php' : 'php/add_product.php';

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                // Success! Redirect back to the main products page
                setTimeout(() => {
                    window.location.href = 'admin_products.php';
                }, 1500);
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = isEditMode ? 'Update Product' : 'Save Product';
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showMessage('An unexpected error occurred.', false);
            submitBtn.disabled = false;
            submitBtn.textContent = isEditMode ? 'Update Product' : 'Save Product';
        });
    });
    
    // Helper to show messages
    function showMessage(message, isSuccess) {
        messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${message}</div>`;
        setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
    }
});