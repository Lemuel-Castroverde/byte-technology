/**
 * scripts/admin_users.js
 * Fetches and displays user data for the admin_users.php page.
 * Handles role updates and user toggling (Disable/Enable).
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('users-table-body');
    const messageContainer = document.getElementById('message-container');

    // 1. Fetch Users
    function fetchUsers() {
        fetch('php/get_users.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderUsers(data.users);
                } else {
                    showMessage(data.message, false);
                    tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
                }
            })
            .catch(error => {
                console.error(error);
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load users.</td></tr>`;
            });
    }

    // 2. Render Table
    function renderUsers(users) {
        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No users found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Check status (default to 'active' if undefined)
            const status = user.status || 'active';
            const isActive = (status === 'active');
            
            // Styling based on status
            const btnClass = isActive ? 'btn-warning' : 'btn-success';
            const btnText = isActive ? 'Disable' : 'Enable';
            const rowOpacity = isActive ? '1' : '0.5'; // Fade out disabled users

            row.innerHTML = `
                <td style="opacity: ${rowOpacity}">${user.full_name}</td>
                <td style="opacity: ${rowOpacity}">${user.email}</td>
                <td>
                    <select class="form-select form-select-sm bg-dark text-white role-select" data-id="${user.id}" ${!isActive ? 'disabled' : ''}>
                        <option value="user" ${user.position === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${user.position === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td class="text-end">
                    <button class="btn ${btnClass} btn-sm toggle-user" data-id="${user.id}" data-name="${user.full_name}" data-status="${status}">
                        ${btnText}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 3. Event Listeners (Toggle & Role Change)
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-user')) {
            const userId = e.target.dataset.id;
            const userName = e.target.dataset.name;
            const currentStatus = e.target.dataset.status;
            
            const actionWord = (currentStatus === 'active') ? 'disable' : 'enable';

            if (confirm(`Are you sure you want to ${actionWord} user: ${userName}?`)) {
                toggleUserStatus(userId, currentStatus);
            }
        }
    });

    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('role-select')) {
            const userId = e.target.dataset.id;
            const newPosition = e.target.value;
            if (confirm(`Change this user's role to ${newPosition}?`)) {
                updateUserRole(userId, newPosition);
            } else {
                fetchUsers(); // Revert selection if canceled
            }
        }
    });

    // 4. Action Functions
    function toggleUserStatus(userId, currentStatus) {
        fetch('php/toggle_user_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, current_status: currentStatus })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) fetchUsers(); // Refresh table to show new state
        });
    }

    function updateUserRole(userId, position) {
        fetch('php/update_user_role.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, position: position })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (!data.success) fetchUsers();
        });
    }
    
    function showMessage(msg, isSuccess) {
        if(messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${msg}</div>`;
            setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
        } else {
            alert(msg);
        }
    }

    // Initial Load
    fetchUsers();
});