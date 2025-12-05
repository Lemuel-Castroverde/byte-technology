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
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <title>Edit Service - Admin Panel</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <header>
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: rgba(0, 0, 0, 0.8);">
                <div class="container-fluid px-4">
                    <a class="navbar-brand fw-bold text-warning" href="index.html">Byte Technology</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav mx-auto gap-4">
                            <li class="nav-item">
                                <a class="nav-link" href="admin.php">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_products.php">Manage Products</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="admin_services.php">Manage Services</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_users.php">Manage Users</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_orders.php">View Orders</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_inquiries.php">Inquiries</a>
                            </li>
                        </ul>

                        <div id="auth-container" class="d-flex align-items-center">
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
            <h2 id="page-title" class="display-5 fw-bold text-center mb-4">Add New <span>Service</span></h2>
            
            <div id="message-container" class="mt-3 mb-3"></div>

            <form id="service-form" class="order-form p-4 mx-auto" style="max-width: 800px;">
                <input type="hidden" id="service-id" name="service_id">
                
                <div class="row g-4">
                    <div class="col-md-7">
                        <div class="mb-3">
                            <label for="name" class="form-label text-light">Service Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label text-light">Starting Price (PHP)</label>
                            <input type="number" class="form-control" id="price" name="price" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label text-light">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="4" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="breakdown" class="form-label text-light">Service Breakdown (one per line)</label>
                            <textarea class="form-control" id="breakdown" name="breakdown" rows="5" placeholder="e.g. &#10;Initial Consultation&#10;System Design&#10;Implementation"></textarea>
                        </div>
                    </div>

                    <div class="col-md-5">
                        <label class="form-label text-light">Service Image</label>
                        <input type="file" class="form-control" id="image" name="image" accept="image/png, image/jpeg, image/gif">
                        <img id="image-preview" src="https://placehold.co/400x400/333/FFF?text=No+Image" alt="Image Preview" class="img-fluid rounded mt-3">
                        <small class="text-light d-block mt-2">Uploading a new image will replace the old one.</small>
                    </div>
                </div>

                <hr class="my-4">

                <div class="d-flex justify-content-end gap-2">
                    <a href="admin_services.php" class="btn btn-outline-light">Cancel</a>
                    <button type="submit" id="submit-btn" class="btn btn-custom">Save Service</button>
                </div>
            </form>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="scripts/auth.js"></script>
        <script src="scripts/admin_edit_service.js"></script>
    </body>
</html>