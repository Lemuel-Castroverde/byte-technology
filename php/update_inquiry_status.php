<?php
// php/update_inquiry_status.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// 1. Check Admin Privileges
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// 2. Get Data
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? 0;
$status = $data['status'] ?? '';

// 3. Validation
$allowedStatuses = ['New', 'Read', 'Replied'];
if ($id == 0 || !in_array($status, $allowedStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid data.']);
    exit;
}

// 4. Update Database
$stmt = $conn->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Status updated.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}

$stmt->close();
$conn->close();
?>