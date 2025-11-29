<?php
// php/delete_service.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$id = $data['id'] ?? 0;
if ($id == 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID.']);
    exit;
}

// 1. Get the image URL to delete the file
$stmt = $conn->prepare("SELECT image_url FROM services WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$service = $result->fetch_assoc();
$stmt->close();

if ($service) {
    // 2. Delete from DB
    $stmt_delete = $conn->prepare("DELETE FROM services WHERE id = ?");
    $stmt_delete->bind_param("i", $id);

    if ($stmt_delete->execute()) {
        // 3. Delete file if exists
        $imagePath = '../' . $service['image_url'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
        echo json_encode(['success' => true, 'message' => 'Service deleted.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
    $stmt_delete->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Service not found.']);
}

$conn->close();
?>