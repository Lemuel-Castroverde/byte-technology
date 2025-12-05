/**
 * scripts/services.js
 * Fetches services and renders them on prodserv.html.
 * Adds the service name to the "Inquire Now" link.
 */
document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.getElementById('services-grid');

    // 1. Fetch Services from Backend
    function fetchServices() {
        fetch('php/public_get_services.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderServices(data.services);
                } else {
                    servicesGrid.innerHTML = `<p class="text-danger">Error loading services.</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                servicesGrid.innerHTML = `<p class="text-danger">Failed to connect.</p>`;
            });
    }

    // 2. Render HTML Cards
    function renderServices(services) {
        if (!services || services.length === 0) {
            servicesGrid.innerHTML = `<p class="text-light">No services available at the moment.</p>`;
            return;
        }

        servicesGrid.innerHTML = ''; 

        services.forEach(service => {
            // Format Price
            const priceFormatted = parseFloat(service.price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Handle Image
            const imageUrl = service.image_url ? service.image_url : 'https://placehold.co/400x300/222/FFF?text=Service';

            // Handle Breakdown List
            let breakdownHtml = '';
            if (service.breakdown) {
                const lines = service.breakdown.split('\n');
                breakdownHtml = '<ul class="text-start small text-light mt-2" style="padding-left: 20px;">';
                lines.forEach(line => {
                    if (line.trim() !== '') {
                        breakdownHtml += `<li>${line.trim()}</li>`;
                    }
                });
                breakdownHtml += '</ul>';
            }

            // --- IMPORTANT: Create the link with the service name ---
            // encodeURIComponent ensures spaces and special chars don't break the link
            const inquiryLink = `contact.html?service=${encodeURIComponent(service.name)}`;

            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 d-flex align-items-stretch';

            col.innerHTML = `
                <div class="card bg-dark text-white border-secondary shadow w-100">
                    <img src="${imageUrl}" class="card-img-top" alt="${service.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-warning">${service.name}</h5>
                        <h6 class="text-light mb-3">Starting at ₱${priceFormatted}</h6>
                        <p class="card-text flex-grow-1">${service.description}</p>
                        
                        ${breakdownHtml ? `<div class="border-top border-secondary pt-2 mt-2"><strong>Includes:</strong>${breakdownHtml}</div>` : ''}
                        
                        <div class="mt-auto pt-3">
                            <a href="${inquiryLink}" class="btn btn-custom w-100">Inquire Now</a>
                        </div>
                    </div>
                </div>
            `;
            servicesGrid.appendChild(col);
        });
    }

    fetchServices();
});