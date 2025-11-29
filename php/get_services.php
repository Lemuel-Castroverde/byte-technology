<?php
// php/get_services.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, description, price, image_url FROM services ORDER BY id DESC");
$stmt->execute();
$result = $stmt->get_result();
$services = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success' => true, 'services' => $services]);

$stmt->close();
$conn->close();
?>