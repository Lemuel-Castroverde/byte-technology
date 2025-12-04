<?php
// php/update_order_status.php
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
$orderId = $data['order_id'] ?? 0;
$newStatus = $data['status'] ?? '';

// 3. Validation
$allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
if ($orderId == 0 || !in_array($newStatus, $allowedStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status or Order ID.']);
    exit;
}

// 4. Update Database
$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $newStatus, $orderId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => "Order #$orderId status updated to $newStatus."]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}

$stmt->close();
$conn->close();
?>