<?php
session_start();
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
        <title>Edit Product - Admin Panel</title>

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
                        
                        <!-- Navigation Links (Centered) -->
                        <!-- mx-auto pushes content to the center, keeping Logo Left and Auth Right -->
                        <ul class="navbar-nav mx-auto gap-4">
                            <li class="nav-item">
                                <a class="nav-link" href="admin.php">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="admin_products.php">Manage Products</a>
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

        <!-- Main Contents -->
        <main class="container my-5">
            <h2 id="page-title" class="display-5 fw-bold text-center mb-4">Add New <span>Product</span></h2>
            
            <div id="message-container" class="mt-3 mb-3"></div>

            <form id="product-form" class="order-form p-4 mx-auto" style="max-width: 800px;">
                <!-- Hidden input for product ID in edit mode -->
                <input type="hidden" id="product-id" name="product_id">
                
                <div class="row g-4">
                    <!-- Left Side: Form Fields -->
                    <div class="col-md-7">
                        <div class="mb-3">
                            <label for="name" class="form-label text-light">Product Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label text-light">Price (PHP)</label>
                            <input type="number" class="form-control" id="price" name="price" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label text-light">Short Description</label>
                            <textarea class="form-control" id="description" name="description" rows="4" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="components" class="form-label text-light">Components (one per line)</label>
                            <textarea class="form-control" id="components" name="components" rows="6"></textarea>
                        </div>
                    </div>

                    <!-- Right Side: Image Upload and Preview -->
                    <div class="col-md-5">
                        <label class="form-label text-light">Product Image</label>
                        <input type="file" class="form-control" id="image" name="image" accept="image/png, image/jpeg, image/gif">
                        <img id="image-preview" src="https://placehold.co/400x400/333/FFF?text=No+Image" alt="Image Preview" class="img-fluid rounded mt-3">
                        <small id="image-help-text" class="form-text text-light d-block mt-2">Uploading a new image will replace the old one.</small>
                    </div>
                </div>

                <hr class="my-4">

                <div class="d-flex justify-content-end gap-2">
                    <a href="admin_products.php" class="btn btn-outline-light">Cancel</a>
                    <button type="submit" id="submit-btn" class="btn btn-custom">Save Product</button>
                </div>
            </form>
        </main>

        <!-- Footer -->
        <footer>
            <div class="container py-4 text-center">
                <div class="row justify-content-center">
                    <div class="col-md-4 mb-3">
                        <h5 class="text-warning fw-bold">Company Information</h5>
                        <p>Byte Technology is a tech-driven company that provides innovative IoT-based agricultural solutions to modernize and simplify farming operations.</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5 class="text-warning fw-bold">Contact Details</h5>
                        <p class="mb-1">📍 Manila, Philippines</p>
                        <p class="mb-1">☎ +63 900 000 0000</p>
                        <p class="mb-1">✉ info@bytetech.com</p>
                        <p>⏰ Mon–Fri, 9:00 AM–6:00 PM</p>
                    </div>
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

        <!-- Product Management JS -->
        <script src="scripts/admin_edit_product.js"></script>

        <!-- Ionicons -->
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    </body>
</html>
