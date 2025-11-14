<?php
// --- DELETE USER SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$userIdToDelete = $data['user_id'] ?? 0;

if ($userIdToDelete == $_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'Error: You cannot delete your own account.']);
    exit;
}

// --- **NEW: CHECK FOR LAST ADMIN** ---
// Check if the user being deleted is an admin
$stmt = $conn->prepare("SELECT position FROM users WHERE id = ?");
$stmt->bind_param("i", $userIdToDelete);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if ($user && $user['position'] === 'admin') {
    // Yes, we are deleting an admin. Count total admins.
    $adminCountResult = $conn->query("SELECT COUNT(*) as count FROM users WHERE position = 'admin'");
    $adminCount = $adminCountResult->fetch_assoc()['count'];

    if ($adminCount <= 1) {
        // This is the last admin, refuse the deletion.
        echo json_encode(['success' => false, 'message' => 'Error: Cannot delete the last admin.']);
        $conn->close();
        exit;
    }
}
// --- **END OF NEW LOGIC** ---


// Delete the user
$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $userIdToDelete);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}

$stmt->close();
$conn->close();
?>