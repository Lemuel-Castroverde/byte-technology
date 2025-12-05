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
        <title>Inquiries - Admin Panel</title>

        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>

        <!-- Header & NavBar -->
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: rgba(0, 0, 0, 0.8);">
                <div class="container-fluid px-4">
                    <a class="navbar-brand fw-bold text-warning" href="index.html">Byte Technology (View Site)</a>
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
                                <a class="nav-link" href="admin_services.php">Manage Services</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_users.php">Manage Users</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="admin_orders.php">View Orders</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="admin_inquiries.php">Inquiries</a>
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

        <!-- Main Contents -->
        <main class="container my-5">
            <h2 class="display-5 fw-bold text-center mb-5">Customer <span>Inquiries</span></h2>
            
            <div id="message-container" class="mt-3 mb-3"></div>

            <div class="table-responsive about-card p-4 admin-table-container">
                <table class="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th style="width: 15%">Date</th>
                            <th style="width: 20%">From</th>
                            <th style="width: 25%">Subject</th>
                            <th style="width: 15%">Status</th>
                            <th style="width: 10%" class="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody id="inquiries-table-body">
                        <tr><td colspan="4" class="text-center">Loading inquiries...</td></tr>
                    </tbody>
                </table>
            </div>
        </main>
        
        <div class="modal fade" id="viewInquiryModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-dark text-white border-secondary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-warning fw-bold">View Message</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="text-secondary small">Sender Details:</label>
                            <p class="fw-bold mb-0" id="modal-name"></p>
                            <p class="small text-light" id="modal-email"></p>
                        </div>
                        <div class="mb-3">
                            <label class="text-secondary small">Subject:</label>
                            <h5 id="modal-subject" class="text-warning"></h5>
                        </div>
                        <div class="mb-3">
                            <label class="text-secondary small">Message:</label>
                            <div class="p-3 rounded bg-secondary bg-opacity-25 border border-secondary" 
                                 id="modal-message" 
                                 style="white-space: pre-wrap; min-height: 150px;"></div>
                        </div>
                    </div>
                    <div class="modal-footer border-secondary">
                        <a href="#" id="reply-link" class="btn btn-custom">Reply via Email</a>
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

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

        <!-- Inquiries Management JS -->
        <script src="scripts/admin_inquiries.js"></script>
        
    </body>
</html>