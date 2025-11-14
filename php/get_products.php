<?php
// --- GET ALL PRODUCTS SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check: Only admins can get products
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// Fetch key product info for the table
$stmt = $conn->prepare("SELECT id, name, price, image_url FROM products ORDER BY name");
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'products' => $products]);

$stmt->close();
$conn->close();
?>
