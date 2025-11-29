<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$id = $_POST['service_id'] ?? 0;
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$breakdown = $_POST['breakdown'] ?? ''; // New
$newImage = $_FILES['image'] ?? null;

if (empty($name) || empty($price) || empty($description) || $id == 0) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing.']);
    exit;
}

$dbPath = '';

// Handle Image Logic
if ($newImage && $newImage['error'] === UPLOAD_ERR_OK) {
    $stmt_old = $conn->prepare("SELECT image_url FROM services WHERE id = ?");
    $stmt_old->bind_param("i", $id);
    $stmt_old->execute();
    $result_old = $stmt_old->get_result();
    $service_old = $result_old->fetch_assoc();
    $stmt_old->close();

    $uploadDir = '../uploads/';
    $imageName = time() . '_' . basename($newImage['name']);
    $targetPath = $uploadDir . $imageName;
    $dbPath = 'uploads/' . $imageName;

    if (move_uploaded_file($newImage['tmp_name'], $targetPath)) {
        if ($service_old && file_exists('../' . $service_old['image_url'])) {
            unlink('../' . $service_old['image_url']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload new image.']);
        exit;
    }
}

// Update Database (Added 'breakdown' to both queries)
if (!empty($dbPath)) {
    $stmt = $conn->prepare("UPDATE services SET name=?, price=?, description=?, breakdown=?, image_url=? WHERE id=?");
    $stmt->bind_param("sdsssi", $name, $price, $description, $breakdown, $dbPath, $id);
} else {
    $stmt = $conn->prepare("UPDATE services SET name=?, price=?, description=?, breakdown=? WHERE id=?");
    $stmt->bind_param("sdssi", $name, $price, $description, $breakdown, $id);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Service updated successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
$stmt->close();
$conn->close();
?>