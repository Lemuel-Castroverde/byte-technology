<?php
// --- GET SINGLE PRODUCT DETAILS SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$productId = $_GET['id'] ?? 0;
if ($productId == 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid Product ID.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
$stmt->close();

if ($product) {
    echo json_encode(['success' => true, 'product' => $product]);
} else {
    echo json_encode(['success' => false, 'message' => 'Product not found.']);
}

$conn->close();
?>
