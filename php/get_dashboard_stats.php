<?php
// php/get_dashboard_stats.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Security Check
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// 1. Total Sales
$salesQuery = $conn->query("SELECT IFNULL(SUM(total_amount), 0) as total FROM orders");
$totalSales = $salesQuery->fetch_assoc()['total'];

// 2. Total Orders
$ordersQuery = $conn->query("SELECT COUNT(*) as count FROM orders");
$totalOrders = $ordersQuery->fetch_assoc()['count'];

// 3. Total Products
$productsQuery = $conn->query("SELECT COUNT(*) as count FROM products");
$totalProducts = $productsQuery->fetch_assoc()['count'];

// 4. Total Users
$usersQuery = $conn->query("SELECT COUNT(*) as count FROM users WHERE position = 'user'");
$totalUsers = $usersQuery->fetch_assoc()['count'];

// 5. Total Services (NEW)
$servicesQuery = $conn->query("SELECT COUNT(*) as count FROM services");
$totalServices = $servicesQuery->fetch_assoc()['count'];

// 6. Total Inquiries (NEW)
$inquiriesQuery = $conn->query("SELECT COUNT(*) as count FROM inquiries");
$totalInquiries = $inquiriesQuery->fetch_assoc()['count'];

echo json_encode([
    'success' => true,
    'sales' => $totalSales,
    'orders' => $totalOrders,
    'products' => $totalProducts,
    'users' => $totalUsers,
    'services' => $totalServices,
    'inquiries' => $totalInquiries
]);

$conn->close();
?>