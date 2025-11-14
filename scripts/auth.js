/**
 * scripts/auth.js
 * Centralized JavaScript for handling user authentication, session checks, 
 * modal switching, and general UI updates across all public pages.
 */

// --- Disable Right-Click and Shortcuts ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    // ... (this part is unchanged) ...
    if (event.ctrlKey && ['a', 'c', 'x', 's', 'u'].includes(event.key.toLowerCase())) {
        event.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const loginModalEl = document.getElementById('loginModal');
    // ... (rest of element references are unchanged) ...
    const signupModalEl = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    const loginBtn = document.getElementById('loginBtn');
    const userGreeting = document.getElementById('user-greeting');
    const userNameEl = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLink = document.getElementById('admin-link');
    
    // --- Utility Functions ---
    const showMessage = (element, message, isSuccess) => {
        // ... (this function is unchanged) ...
        if (element) {
            element.textContent = message;
            element.className = isSuccess ? 'text-center mb-2 text-success' : 'text-center mb-2 text-danger';
        }
    };

    const updateUI = (isLoggedIn, userName = '', position = 'user') => {
        // ... (this function is unchanged) ...
        if (isLoggedIn) {
            loginBtn.classList.add('d-none');
            userGreeting.classList.remove('d-none');
            userGreeting.classList.add('d-flex');
            userNameEl.textContent = `Hi, ${userName}`;
            if (adminLink) {
                if (position === 'admin') {
                    adminLink.classList.remove('d-none');
                } else {
                    adminLink.classList.add('d-none');
                }
            }
            if (window.location.pathname.endsWith('checkout.html') && data.userEmail) {
                const fullNameInput = document.getElementById('fullName');
                const emailInput = document.getElementById('email');
                if (fullNameInput) fullNameInput.value = userName;
            }
        } else {
            loginBtn.classList.remove('d-none');
            userGreeting.classList.add('d-none');
            userGreeting.classList.remove('d-flex');
            userNameEl.textContent = '';
            if (adminLink) adminLink.classList.add('d-none');
        }
    };

    const setActiveNav = () => {
        // ... (this function is unchanged) ...
        const path = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    };
    
    // --- Modal Reset and Switch Logic ---
    // ... (this entire section is unchanged) ...
    if (loginModalEl) loginModalEl.addEventListener('hidden.bs.modal', function () {
        loginModalEl.querySelector('form').reset();
    });
    if (signupModalEl) signupModalEl.addEventListener('hidden.bs.modal', function () {
        signupModalEl.querySelector('form').reset();
    });
    let openSignupModal = false;
    let openLoginModal = false;
    if (loginModalEl) loginModalEl.addEventListener('hidden.bs.modal', function () {
        if (openSignupModal) {
            const signupModal = new bootstrap.Modal(signupModalEl);
            signupModal.show();
            openSignupModal = false;
        }
    });
    if (signupModalEl) signupModalEl.addEventListener('hidden.bs.modal', function () {
        if (openLoginModal) {
            const loginModal = new bootstrap.Modal(loginModalEl);
            loginModal.show();
            openLoginModal = false;
        }
    });
    const switchToSignup = document.getElementById('switchToSignup');
    if (switchToSignup) switchToSignup.addEventListener('click', function (e) {
        e.preventDefault();
        openSignupModal = true;
        bootstrap.Modal.getInstance(loginModalEl).hide();
    });
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) switchToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        openLoginModal = true;
        bootstrap.Modal.getInstance(signupModalEl).hide();
    });
    if (loginModalEl) loginModalEl.addEventListener('hidden.bs.modal', function () {
        loginModalEl.querySelector('form').reset();
    });
    if (signupModalEl) signupModalEl.addEventListener('hidden.bs.modal', function () {
        signupModalEl.querySelector('form').reset();
    });

    // --- Authentication Event Handlers ---

    // UPDATED: Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            fetch('php/login.php', { method: 'POST', body: new FormData(loginForm) })
                .then(res => res.json())
                .then(data => {
                    showMessage(loginMessage, data.message, data.success);
                    
                    if (data.success) {
                        setTimeout(() => {
                            bootstrap.Modal.getInstance(loginModalEl).hide();
                            
                            // --- NEW LOGIC HERE ---
                            // Check if we were trying to check out
                            if (sessionStorage.getItem('pendingCheckout') === 'true') {
                                // Clear the flag and redirect to checkout
                                sessionStorage.removeItem('pendingCheckout');
                                window.location.href = 'checkout.html';
                            } else {
                                // Otherwise, just reload the current page
                                location.reload(); 
                            }
                            // --- END OF NEW LOGIC ---

                        }, 1000);
                    }
                });
        });
    }

    // Signup Form Submission
    if (signupForm) {
        // ... (this function is unchanged) ...
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fetch('php/register.php', { method: 'POST', body: new FormData(signupForm) })
                .then(res => res.json())
                .then(data => {
                    showMessage(signupMessage, data.message, data.success);
                    if (data.success) {
                        signupForm.reset();
                    }
                });
        });
    }
    
    // Logout Button
    if (logoutBtn) {
        // ... (this function is unchanged) ...
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                fetch('php/logout.php')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            updateUI(false);
                            if (window.location.pathname.includes('admin') || window.location.pathname.endsWith('checkout.html')) {
                                window.location.href = 'index.html';
                            }
                        }
                    });
            }
        });
    }

    // --- Initial Session Check on Load ---
    fetch('php/check_session.php')
        // ... (this function is unchanged) ...
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                updateUI(true, data.userName, data.position);
            } else {
                updateUI(false);
            }
            setActiveNav();
        });
});