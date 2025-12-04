<?php
session_start();

// --- PREVENT CACHING ---
// Ensure the browser always requests the page from the server to check session validity
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Check if the user is NOT logged in OR if their position is NOT 'admin'.
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    // Redirect them to the main page
    header('Location: index.html');
    exit; // Stop executing the rest of the PHP and HTML
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Admin Dashboard - Byte Technology</title>

        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <!-- Header & NavBar -->
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: rgba(0, 0, 0, 0.8);">
                <!-- 'container-fluid' allows full width, 'px-4' adds small spacing from the absolute edge -->
                <div class="container-fluid px-4">
                    
                    <!-- Logo / Brand (Far Left) -->
                    <a class="navbar-brand fw-bold text-warning" href="index.html">
                        Byte Technology (View Site)
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav mx-auto gap-4">
                            <li class="nav-item">
                                <a class="nav-link active" href="admin.php">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_products.php">Manage Products</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_services.php">Manage Services</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_users.php">Manage Users</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_orders.php">View Orders</a>
                            </li>
                        </ul>

                        <!-- Auth Container (Far Right) -->
                        <div id="auth-container" class="d-flex align-items-center">
                            <button id="loginBtn" type="button" class="btn btn-custom d-none" data-bs-toggle="modal" data-bs-target="#loginModal">
                                Login / Sign Up
                            </button>
                            
                            <div id="user-greeting" class="d-flex align-items-center gap-2">
                                <span id="userName" class="text-white"></span>
                                <button id="logoutBtn" class="btn btn-outline-warning">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <main class="container my-5">
            <h2 class="display-5 fw-bold text-center mb-5">Admin <span>Panel</span></h2>
            
            <!-- Dynamic Stats Row -->
            <div class="row g-4 mb-5 text-center">
                <div class="col-md-3">
                    <div class="p-3 bg-dark border border-warning rounded shadow h-100 d-flex flex-column justify-content-center">
                        <h3 class="text-warning fw-bold mb-0" id="total-sales">Loading...</h3>
                        <p class="text-light mb-0 mt-2">Total Sales</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-dark border border-secondary rounded shadow h-100 d-flex flex-column justify-content-center">
                        <h3 class="text-white fw-bold mb-0" id="total-orders">0</h3>
                        <p class="text-light mb-0 mt-2">Total Orders</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-dark border border-secondary rounded shadow h-100 d-flex flex-column justify-content-center">
                        <h3 class="text-white fw-bold mb-0" id="total-products">0</h3>
                        <p class="text-light mb-0 mt-2">Active Products</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-dark border border-secondary rounded shadow h-100 d-flex flex-column justify-content-center">
                        <h3 class="text-white fw-bold mb-0" id="total-users">0</h3>
                        <p class="text-light mb-0 mt-2">Registered Users</p>
                    </div>
                </div>
            </div>

            <!-- Navigation Cards (2x2 Grid) -->
            <div class="row g-4">
                <!-- 1. Products -->
                <div class="col-md-6">
                    <div class="about-card p-4 h-100">
                        <h4 class="text-warning fw-bold">Manage Products</h4>
                        <p>Add, edit, or remove products from the store.</p>
                        <a href="admin_products.php" class="btn btn-outline-warning mt-auto">Go to Products</a>
                    </div>
                </div>

                <!-- 2. Services -->
                <div class="col-md-6">
                    <div class="about-card p-4 h-100">
                        <h4 class="text-warning fw-bold">Manage Services</h4>
                        <p>Add, edit, or remove services offered.</p>
                        <a href="admin_services.php" class="btn btn-outline-warning mt-auto">Go to Services</a>
                    </div>
                </div>

                <!-- 3. Users -->
                <div class="col-md-6">
                    <div class="about-card p-4 h-100">
                        <h4 class="text-warning fw-bold">Manage Users</h4>
                        <p>View all registered users and change their roles.</p>
                        <a href="admin_users.php" class="btn btn-outline-warning mt-auto">Go to Users</a>
                    </div>
                </div>

                <!-- 4. Orders -->
                <div class="col-md-6">
                    <div class="about-card p-4 h-100">
                        <h4 class="text-warning fw-bold">View Orders</h4>
                        <p>View submitted orders from customers.</p>
                        <a href="admin_orders.php" class="btn btn-outline-warning mt-auto">Go to Orders</a>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer-->
        <footer>
            <div class="container py-4 text-center">
                <div class="row justify-content-center">

                    <!-- Company Information -->
                    <div class="col-md-4 mb-3">
                        <h5 class="text-warning fw-bold">Company Information</h5>
                        <p>
                            Byte Technology is a tech-driven company that provides innovative IoT-based
                            agricultural solutions to modernize and simplify farming operations.
                        </p>
                    </div>

                    <!-- Contact Details -->
                    <div class="col-md-4 mb-3">
                        <h5 class="text-warning fw-bold">Contact Details</h5>
                        <p class="mb-1">📍 Manila, Philippines</p>
                        <p class="mb-1">☎ +63 900 000 0000</p>
                        <p class="mb-1">✉ info@bytetech.com</p>
                        <p>⏰ Mon–Fri, 9:00 AM–6:00 PM</p>
                    </div>

                    <!-- Social Media Links -->
                    <div class="col-md-3 mb-3">
                        <h5 class="text-warning fw-bold">Follow Us</h5>
                        <div class="social-icons d-flex justify-content-center">
                            <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                            <a href="#"><ion-icon name="logo-linkedin"></ion-icon></a>
                            <a href="#"><ion-icon name="logo-youtube"></ion-icon></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        
        <!-- Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

        <!-- Autherntication JS -->
        <script src="scripts/auth.js"></script>

        <!-- Admin Dashboard JS -->
        <script src="scripts/admin_dashboard.js"></script>

        <!-- Ionicons -->
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    </body>
</html>