<?php
// php/add_to_cart.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to add items to cart.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'];
$productId = $data['product_id'];
$quantity = $data['quantity'] ?? 1;

// Check if item already exists in user's cart
$stmt = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
$stmt->bind_param("ii", $userId, $productId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update quantity
    $row = $result->fetch_assoc();
    $newQuantity = $row['quantity'] + $quantity;
    $updateStmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    $updateStmt->bind_param("ii", $newQuantity, $row['id']);
    $updateStmt->execute();
} else {
    // Insert new item
    $insertStmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $insertStmt->bind_param("iii", $userId, $productId, $quantity);
    $insertStmt->execute();
}

echo json_encode(['success' => true, 'message' => 'Item added to cart']);
$conn->close();
?>