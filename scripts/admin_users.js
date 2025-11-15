/**
 * scripts/admin_users.js
 * Fetches and displays user data for the admin_users.php page.
 * Handles role updates and user deletions.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('users-table-body');
    const messageContainer = document.getElementById('message-container');

    // Function to fetch and render users
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
                console.error('Error fetching users:', error);
                showMessage('Failed to load users.', false);
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load users.</td></tr>`;
            });
    }

    // Function to render the user table
    function renderUsers(users) {
        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No users found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = ''; // Clear "Loading..."
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>
                    <select class="form-select form-select-sm bg-dark text-white role-select" data-id="${user.id}">
                        <option value="user" ${user.position === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${user.position === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td class="text-end">
                    <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}" data-name="${user.full_name}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Event listener for table actions (delete, role change)
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-user')) {
            const userId = e.target.dataset.id;
            const userName = e.target.dataset.name;
            if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
                deleteUser(userId);
            }
        }
    });

    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('role-select')) {
            const userId = e.target.dataset.id;
            const newPosition = e.target.value;
            if (confirm(`Are you sure you want to change this user's role to ${newPosition}?`)) {
                updateUserRole(userId, newPosition);
            } else {
                // Revert dropdown if "Cancel" is clicked
                fetchUsers();
            }
        }
    });

    // --- Action Functions ---

    function deleteUser(userId) {
        fetch('php/delete_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                fetchUsers(); // Refresh the table
            }
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
            if (!data.success) {
                fetchUsers(); // Revert on failure
            }
        });
    }
    
    // Helper to show messages
    function showMessage(message, isSuccess) {
        messageContainer.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${message}</div>`;
        setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
    }

    // Initial fetch on page load
    fetchUsers();
});