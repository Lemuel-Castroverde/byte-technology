<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$breakdown = $_POST['breakdown'] ?? ''; // New
$image = $_FILES['image'] ?? null;

if (empty($name) || empty($price) || empty($description) || $image === null || $image['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'All fields and a valid image are required.']);
    exit;
}

$uploadDir = '../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$imageName = time() . '_' . basename($image['name']);
$targetPath = $uploadDir . $imageName;
$dbPath = 'uploads/' . $imageName;

if (move_uploaded_file($image['tmp_name'], $targetPath)) {
    // Added 'breakdown' to INSERT query
    $stmt = $conn->prepare("INSERT INTO services (name, price, description, breakdown, image_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsss", $name, $price, $description, $breakdown, $dbPath);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Service added successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error on insert.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
}

$conn->close();
?>