<?php
// --- ADD PRODUCT SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// 1. Get form data
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$components = $_POST['components'] ?? '';
$image = $_FILES['image'] ?? null;

// 2. Validate data
if (empty($name) || empty($price) || empty($description) || $image === null || $image['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'All fields and a valid image are required.']);
    exit;
}

// 3. Handle image upload
$uploadDir = '../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
$imageName = time() . '_' . basename($image['name']);
$targetPath = $uploadDir . $imageName;
$dbPath = 'uploads/' . $imageName; // Path to store in DB

if (move_uploaded_file($image['tmp_name'], $targetPath)) {
    // 4. Insert into database
    $stmt = $conn->prepare("INSERT INTO products (name, price, description, components, image_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsss", $name, $price, $description, $components, $dbPath);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product added successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error on insert.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
}

$conn->close();
?>
