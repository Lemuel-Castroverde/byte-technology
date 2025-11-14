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
        <title>Manage Orders - Admin Panel</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <header>
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: rgba(0, 0, 0, 0.8);">
                <div class="container">
                    <a class="navbar-brand fw-bold text-warning" href="index.html">
                        Byte Technology (View Site)
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="admin.php">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_products.php">Manage Products</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_users.php">Manage Users</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="admin_orders.php">View Orders</a>
                            </li>
                        </ul>
                    </div>

                    <div id="auth-container">
                        <div id="user-greeting" class="d-flex align-items-center gap-2">
                            <span id="userName" class="text-white"></span>
                            <button id="logoutBtn" class="btn btn-outline-warning">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <main class="container my-5">
            <h2 class="display-5 fw-bold text-center mb-5">Manage <span>Orders</span></h2>
            
            <div id="message-container" class="mt-3 mb-3"></div>

            <div class="table-responsive about-card p-4 admin-table-container">
                <table class="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Order Date</th>
                            <th>Items Summary</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="orders-table-body">
                        <tr>
                            <td colspan="6" class="text-center">Loading orders...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>

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
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

        <script src="scripts/auth.js"></script>

        <script src="scripts/admin_orders.js"></script>

        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    </body>
</html>