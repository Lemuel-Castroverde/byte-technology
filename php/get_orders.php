<?php
// --- GET ALL ORDERS SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check: Only admins can get orders
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// SQL query to get all orders AND a summary of the items in each order
$query = "
    SELECT 
        o.id, 
        o.full_name, 
        o.order_date, 
        o.total_amount, 
        o.status,
        GROUP_CONCAT(oi.product_name, ' (x', oi.quantity, ')' SEPARATOR '<br>') AS items_summary
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.order_date DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();
$orders = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'orders' => $orders]);

$stmt->close();
$conn->close();
?>