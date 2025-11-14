<?php
// --- GET ALL USERS SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check: Only admins can get users
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// Fetch all users. IMPORTANT: NEVER select the password hash.
$stmt = $conn->prepare("SELECT id, full_name, email, position FROM users ORDER BY full_name");
$stmt->execute();
$result = $stmt->get_result();
$users = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'users' => $users]);

$stmt->close();
$conn->close();
?>