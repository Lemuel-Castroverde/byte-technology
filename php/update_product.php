<?php
// --- UPDATE PRODUCT SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

// 1. Get form data
$productId = $_POST['product_id'] ?? 0;
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$components = $_POST['components'] ?? '';
$newImage = $_FILES['image'] ?? null;

// 2. Validate data
if (empty($name) || empty($price) || empty($description) || $productId == 0) {
    echo json_encode(['success' => false, 'message' => 'Name, price, and description are required.']);
    exit;
}

$dbPath = '';

// 3. Handle image upload (if a new one is provided)
if ($newImage && $newImage['error'] === UPLOAD_ERR_OK) {
    // A. Get old image path to delete it
    $stmt_old = $conn->prepare("SELECT image_url FROM products WHERE id = ?");
    $stmt_old->bind_param("i", $productId);
    $stmt_old->execute();
    $result_old = $stmt_old->get_result();
    $product_old = $result_old->fetch_assoc();
    $stmt_old->close();

    // B. Upload new image
    $uploadDir = '../uploads/';
    $imageName = time() . '_' . basename($newImage['name']);
    $targetPath = $uploadDir . $imageName;
    $dbPath = 'uploads/' . $imageName;

    if (move_uploaded_file($newImage['tmp_name'], $targetPath)) {
        // C. Delete old image file
        if ($product_old && file_exists('../' . $product_old['image_url'])) {
            unlink('../' . $product_old['image_url']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload new image.']);
        exit;
    }
}

// 4. Update database
if (!empty($dbPath)) {
    // If a new image was uploaded, update the image_url field
    $stmt = $conn->prepare("UPDATE products SET name=?, price=?, description=?, components=?, image_url=? WHERE id=?");
    $stmt->bind_param("sdsssi", $name, $price, $description, $components, $dbPath, $productId);
} else {
    // If no new image, don't update the image_url field
    $stmt = $conn->prepare("UPDATE products SET name=?, price=?, description=?, components=? WHERE id=?");
    $stmt->bind_param("sdssi", $name, $price, $description, $components, $productId);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Product updated successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error on update.']);
}
$stmt->close();
$conn->close();
?>
