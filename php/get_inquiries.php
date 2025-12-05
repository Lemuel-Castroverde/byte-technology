<?php
// php/get_inquiries.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check: Only admins can view inquiries
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// Fetch all inquiries
$stmt = $conn->prepare("SELECT * FROM inquiries ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();
$inquiries = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'inquiries' => $inquiries]);

$stmt->close();
$conn->close();
?>