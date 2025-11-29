<?php
// --- USER LOGOUT SCRIPT ---
// Destroys the current session.

session_start();

// Unset all of the session variables
$_SESSION = [];

// Destroy the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// --- PREVENT CACHING ---
// Tell the browser to not cache the page state after logout
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Send a success response
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'You have been logged out.']);
?>