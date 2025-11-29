/**
 * scripts/auth.js
 * Centralized JavaScript for handling user authentication, session checks, 
 * modal switching, and general UI updates across all public pages.
 */

// --- Disable Right-Click and Shortcuts ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.ctrlKey && ['a', 'c', 'x', 's', 'u'].includes(event.key.toLowerCase())) {
        event.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const loginModalEl = document.getElementById('loginModal');
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
    const myOrdersLink = document.getElementById('my-orders-link'); // Ensure this exists in HTML or remove if unused
    
    // --- Utility Functions ---
    const showMessage = (element, message, isSuccess) => {
        if (element) {
            element.textContent = message;
            element.className = isSuccess ? 'text-center mb-2 text-success' : 'text-center mb-2 text-danger';
        }
    };

    const updateUI = (isLoggedIn, userName = '', position = 'user') => {
        if (isLoggedIn) {
            if (loginBtn) loginBtn.classList.add('d-none');
            if (userGreeting) {
                userGreeting.classList.remove('d-none');
                userGreeting.classList.add('d-flex');
            }
            if (userNameEl) userNameEl.textContent = `Hi, ${userName}`;
            if (adminLink) {
                if (position === 'admin') {
                    adminLink.classList.remove('d-none');
                } else {
                    adminLink.classList.add('d-none');
                }
            }
            if (myOrdersLink) myOrdersLink.classList.remove('d-none');

            // Autofill checkout fields if on checkout page
            if (window.location.pathname.endsWith('checkout.html')) {
                const fullNameInput = document.getElementById('fullName');
                const emailInput = document.getElementById('email');
                if (fullNameInput && userName) fullNameInput.value = userName;
            }
        } else {
            if (loginBtn) loginBtn.classList.remove('d-none');
            if (userGreeting) {
                userGreeting.classList.add('d-none');
                userGreeting.classList.remove('d-flex');
            }
            if (userNameEl) userNameEl.textContent = '';
            if (adminLink) adminLink.classList.add('d-none');
            if (myOrdersLink) myOrdersLink.classList.add('d-none');
        }
    };

    const setActiveNav = () => {
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
    let openSignupModal = false;
    let openLoginModal = false;

    if (loginModalEl) {
        loginModalEl.addEventListener('hidden.bs.modal', function () {
            if (openSignupModal) {
                const signupModal = new bootstrap.Modal(signupModalEl);
                signupModal.show();
                openSignupModal = false;
            } else {
                loginModalEl.querySelector('form').reset();
            }
        });
    }

    if (signupModalEl) {
        signupModalEl.addEventListener('hidden.bs.modal', function () {
            if (openLoginModal) {
                const loginModal = new bootstrap.Modal(loginModalEl);
                loginModal.show();
                openLoginModal = false;
            } else {
                signupModalEl.querySelector('form').reset();
            }
        });
    }

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

    // --- Authentication Event Handlers ---

    // Login Form Submission
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
                            // Check if we were trying to check out
                            if (sessionStorage.getItem('pendingCheckout') === 'true') {
                                sessionStorage.removeItem('pendingCheckout');
                                window.location.href = 'checkout.html';
                            } else {
                                location.reload(); 
                            }
                        }, 1000);
                    }
                });
        });
    }

    // Signup Form Submission
    if (signupForm) {
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
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                fetch('php/logout.php')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            updateUI(false);
                            // If on a protected page, go home
                            if (window.location.pathname.includes('admin') || window.location.pathname.endsWith('checkout.html')) {
                                window.location.href = 'index.html';
                            } else {
                                // Reload to clear user data from view
                                location.reload();
                            }
                        }
                    });
            }
        });
    }

    // --- SESSION CHECK LOGIC ---

    // 1. Define the check function
    // We add a timestamp query param (?t=...) to bypass browser caching of the fetch request
    function checkSession() {
        fetch('php/check_session.php?t=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                if (data.loggedin) {
                    updateUI(true, data.userName, data.position);
                } else {
                    updateUI(false);
                    // If user is on a protected page but session is dead, kick them out
                    if (window.location.pathname.includes('admin') || window.location.pathname.endsWith('checkout.html')) {
                        window.location.href = 'index.html';
                    }
                }
                setActiveNav();
            })
            .catch(err => console.error("Session check failed", err));
    }

    // 2. Call it immediately on page load
    checkSession();

    // 3. FORCE CHECK ON BACK BUTTON
    // The 'pageshow' event fires when the page is being shown, even from the bfcache (back-forward cache).
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            console.log("Page restored from cache. Re-checking session...");
            checkSession();
        }
    });
});