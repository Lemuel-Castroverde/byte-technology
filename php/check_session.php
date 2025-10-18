<?php
// --- SESSION CHECK SCRIPT ---
// Checks if a user is currently logged in.

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // If the session is active, return user data
    echo json_encode([
        'loggedin' => true,
        'userName' => $_SESSION['user_name'] ?? 'User'
    ]);
} else {
    // If not logged in, return false
    echo json_encode(['loggedin' => false]);
}
?>
