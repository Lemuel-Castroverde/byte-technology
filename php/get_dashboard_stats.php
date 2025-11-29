<?php
// php/get_dashboard_stats.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check: Only admins should see financial stats
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// 1. Total Sales (Sum of total_amount from orders)
// IFNULL ensures we return 0 instead of null if table is empty
$salesQuery = $conn->query("SELECT IFNULL(SUM(total_amount), 0) as total FROM orders");
$totalSales = $salesQuery->fetch_assoc()['total'];

// 2. Total Orders (Count of rows)
$ordersQuery = $conn->query("SELECT COUNT(*) as count FROM orders");
$totalOrders = $ordersQuery->fetch_assoc()['count'];

// 3. Total Products
$productsQuery = $conn->query("SELECT COUNT(*) as count FROM products");
$totalProducts = $productsQuery->fetch_assoc()['count'];

// 4. Total Users (We only count 'user', not 'admin')
$usersQuery = $conn->query("SELECT COUNT(*) as count FROM users WHERE position = 'user'");
$totalUsers = $usersQuery->fetch_assoc()['count'];

echo json_encode([
    'success' => true,
    'sales' => $totalSales,
    'orders' => $totalOrders,
    'products' => $totalProducts,
    'users' => $totalUsers
]);

$conn->close();
?>