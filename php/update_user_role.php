<?php
// --- UPDATE USER ROLE SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$userIdToUpdate = $data['user_id'] ?? 0;
$newPosition = $data['position'] ?? 'user';

if ($userIdToUpdate == $_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'Error: You cannot change your own role.']);
    exit;
}

// --- **NEW: CHECK FOR LAST ADMIN** ---
if ($newPosition === 'user') {
    // Check if the user being updated is currently an admin
    $stmt = $conn->prepare("SELECT position FROM users WHERE id = ?");
    $stmt->bind_param("i", $userIdToUpdate);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user && $user['position'] === 'admin') {
        // Yes, we are demoting an admin. Let's count how many admins are left.
        $adminCountResult = $conn->query("SELECT COUNT(*) as count FROM users WHERE position = 'admin'");
        $adminCount = $adminCountResult->fetch_assoc()['count'];

        if ($adminCount <= 1) {
            // This is the last admin, refuse the update.
            echo json_encode(['success' => false, 'message' => 'Error: Cannot demote the last admin.']);
            $conn->close();
            exit;
        }
    }
}
// --- **END OF NEW LOGIC** ---

// Proceed with update
$stmt = $conn->prepare("UPDATE users SET position = ? WHERE id = ?");
$stmt->bind_param("si", $newPosition, $userIdToUpdate);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User role updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}

$stmt->close();
$conn->close();
?>