<?php
// --- SESSION CHECK SCRIPT ---
// Checks if a user is currently logged in.

session_start();

// --- PREVENT CACHING ---
// Ensure the browser always asks the server for the latest session status
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // If the session is active, return user data
    echo json_encode([
        'loggedin' => true,
        'userName' => $_SESSION['user_name'] ?? 'User',
        'email' => $_SESSION['email'] ?? '', // <--- NEW: Return the email
        'position' => $_SESSION['position'] ?? 'user',
        'user_id' => $_SESSION['user_id'] ?? 0
    ]);
} else {
    // If not logged in, return false
    echo json_encode(['loggedin' => false]);
}
?>