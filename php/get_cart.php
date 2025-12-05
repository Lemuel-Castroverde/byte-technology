<?php
// php/get_cart.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin'])) {
    echo json_encode(['success' => true, 'cart' => []]); // Empty cart for guests
    exit;
}

$userId = $_SESSION['user_id'];

$sql = "SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$cart = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'cart' => $cart]);
$conn->close();
?>