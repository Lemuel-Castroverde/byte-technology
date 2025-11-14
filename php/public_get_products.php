<?php
// --- PUBLIC GET ALL PRODUCTS SCRIPT ---
// This script does NOT have an admin security check, as it's for the public-facing site.
require 'db_connect.php';
header('Content-Type: application/json');

// Fetch all product data needed for the cards and details page
$stmt = $conn->prepare("SELECT id, name, description, price, image_url, components FROM products ORDER BY name");
$stmt->execute();
$result = $stmt->get_result();
$products = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'products' => $products]);

$stmt->close();
$conn->close();
?>
