<?php
// --- USER LOGOUT SCRIPT ---
// Destroys the current session.

session_start();

// Unset all of the session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Send a success response
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'You have been logged out.']);
?>
