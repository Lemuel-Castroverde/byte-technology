<?php
// --- DELETE PRODUCT SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Security Check
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$productId = $data['product_id'] ?? 0;
if ($productId == 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid Product ID.']);
    exit;
}

// 1. Get the image URL to delete the file
$stmt = $conn->prepare("SELECT image_url FROM products WHERE id = ?");
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
$stmt->close();

if ($product) {
    // 2. Delete the product from the database
    $stmt_delete = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt_delete->bind_param("i", $productId);
    
    if ($stmt_delete->execute()) {
        // 3. If DB delete is successful, delete the image file from server
        // The image path in DB is relative, e.g., "uploads/image.png"
        $imagePath = '../' . $product['image_url']; // Go up one directory from /php
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
    $stmt_delete->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Product not found.']);
}

$conn->close();
?>
