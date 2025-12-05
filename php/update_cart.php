<?php
// php/update_cart.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin'])) exit;

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'];
$cartId = $data['cart_id'];
$action = $data['action']; // 'increase', 'decrease', 'remove'

if ($action === 'remove') {
    $stmt = $conn->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $cartId, $userId);
    $stmt->execute();
} elseif ($action === 'increase' || $action === 'decrease') {
    // Get current qty
    $stmt = $conn->prepare("SELECT quantity FROM cart WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $cartId, $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    
    if ($row = $res->fetch_assoc()) {
        $newQty = ($action === 'increase') ? $row['quantity'] + 1 : $row['quantity'] - 1;
        
        if ($newQty > 0) {
            $update = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
            $update->bind_param("ii", $newQty, $cartId);
            $update->execute();
        } else {
            // Remove if qty hits 0
            $del = $conn->prepare("DELETE FROM cart WHERE id = ?");
            $del->bind_param("i", $cartId);
            $del->execute();
        }
    }
}

echo json_encode(['success' => true]);
$conn->close();
?>