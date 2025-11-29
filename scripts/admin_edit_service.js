/**
 * scripts/admin_edit_service.js
 * Handles Adding and Editing services.
 */
document.addEventListener('DOMContentLoaded', () => {
    const serviceForm = document.getElementById('service-form');
    const pageTitle = document.getElementById('page-title');
    const submitBtn = document.getElementById('submit-btn');
    const messageContainer = document.getElementById('message-container');
    
    // Inputs
    const serviceIdInput = document.getElementById('service-id');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const breakdownInput = document.getElementById('breakdown'); // New
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const isEditMode = (serviceId !== null);

    if (isEditMode) {
        pageTitle.innerHTML = 'Edit <span>Service</span>';
        submitBtn.textContent = 'Update Service';
        
        fetch(`php/get_service_details.php?id=${serviceId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const s = data.service;
                    serviceIdInput.value = s.id;
                    nameInput.value = s.name;
                    priceInput.value = s.price;
                    descriptionInput.value = s.description;
                    breakdownInput.value = s.breakdown || ''; // Load breakdown
                    
                    if (s.image_url) {
                        imagePreview.src = s.image_url;
                    }
                } else {
                    showMessage('Failed to load service details.', false);
                }
            })
            .catch(err => console.error(err));
    } else {
        pageTitle.innerHTML = 'Add New <span>Service</span>';
        submitBtn.textContent = 'Save Service';
    }

    // Image Preview
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) { imagePreview.src = e.target.result; }
            reader.readAsDataURL(file);
        }
    });

    // Submit
    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        const formData = new FormData(serviceForm);
        const url = isEditMode ? 'php/update_service.php' : 'php/add_service.php';

        fetch(url, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                setTimeout(() => { window.location.href = 'admin_services.php'; }, 1500);
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = isEditMode ? 'Update Service' : 'Save Service';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An unexpected error occurred.', false);
            submitBtn.disabled = false;
            submitBtn.textContent = isEditMode ? 'Update Service' : 'Save Service';
        });
    });
    
    function showMessage(msg, isSuccess) {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${msg}</div>`;
            setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
        } else {
            alert(msg);
        }
    }
});