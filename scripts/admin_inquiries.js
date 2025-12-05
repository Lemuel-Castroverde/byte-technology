/**
 * scripts/admin_inquiries.js
 * Fetches inquiries, handles status updates, and opens the details modal.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('inquiries-table-body');
    const messageContainer = document.getElementById('message-container');
    
    // Global variable to store fetched data so we can access it for the modal
    let allInquiries = [];

    // 1. Fetch Inquiries
    function fetchInquiries() {
        fetch('php/get_inquiries.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    allInquiries = data.inquiries;
                    renderInquiries(allInquiries);
                } else {
                    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${data.message}</td></tr>`;
                }
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load inquiries.</td></tr>`;
            });
    }

    // 2. Render Table
    function renderInquiries(inquiries) {
        if (inquiries.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No inquiries found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = '';

        inquiries.forEach(item => {
            const row = document.createElement('tr');

            // Format Date
            const dateObj = new Date(item.created_at);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // Status Options
            const statuses = ['New', 'Read', 'Replied'];
            let selectHtml = `<select class="form-select form-select-sm bg-dark text-white border-secondary status-select" data-id="${item.id}">`;
            statuses.forEach(st => {
                const selected = (item.status === st) ? 'selected' : '';
                selectHtml += `<option value="${st}" ${selected}>${st}</option>`;
            });
            selectHtml += `</select>`;

            // Create Row
            row.innerHTML = `
                <td class="text-secondary small">${dateStr}</td>
                <td>
                    <div class="fw-bold text-white">${item.name}</div>
                    <div class="small text-secondary">${item.email}</div>
                </td>
                <td class="text-warning fw-bold text-truncate" style="max-width: 200px;">${item.subject}</td>
                <td>${selectHtml}</td>
                <td class="text-end">
                    <button class="btn btn-outline-info btn-sm view-btn" data-id="${item.id}">
                        View
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 3. Event Listeners (Status Change & View Button)
    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            updateStatus(id, newStatus);
        }
    });

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) {
            const id = e.target.dataset.id;
            const inquiry = allInquiries.find(i => i.id == id);
            if (inquiry) {
                openModal(inquiry);
            }
        }
    });

    // 4. Update Status Logic
    function updateStatus(id, status) {
        fetch('php/update_inquiry_status.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: id, status: status })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage("Status updated.", true);
            } else {
                showMessage("Failed to update status.", false);
            }
        });
    }

    // 5. Open Modal Logic
    function openModal(item) {
        document.getElementById('modal-name').textContent = item.name;
        document.getElementById('modal-email').textContent = item.email;
        document.getElementById('modal-subject').textContent = item.subject;
        document.getElementById('modal-message').textContent = item.message;
        
        // Setup "Reply via Email" link
        const replyLink = document.getElementById('reply-link');
        replyLink.href = `mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`;

        const modal = new bootstrap.Modal(document.getElementById('viewInquiryModal'));
        modal.show();
    }

    function showMessage(msg, isSuccess) {
        if(messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'} py-2">${msg}</div>`;
            setTimeout(() => { messageContainer.innerHTML = ''; }, 2000);
        }
    }

    // Initial Load
    fetchInquiries();
});