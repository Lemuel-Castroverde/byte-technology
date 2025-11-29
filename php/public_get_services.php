<?php
// php/public_get_services.php
require 'db_connect.php';
header('Content-Type: application/json');

// Select necessary fields including the new image and breakdown
$stmt = $conn->prepare("SELECT id, name, price, description, breakdown, image_url FROM services ORDER BY id DESC");
$stmt->execute();
$result = $stmt->get_result();
$services = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'services' => $services]);

$stmt->close();
$conn->close();
?>