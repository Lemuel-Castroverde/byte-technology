<?php
// php/toggle_user_status.php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// 1. Check Admin Privileges
if (!isset($_SESSION['loggedin']) || $_SESSION['position'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access Denied']);
    exit;
}

$userId = $data['user_id'] ?? 0;
$currentStatus = $data['current_status'] ?? 'active';

// 2. Prevent disabling yourself
if ($userId == $_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'You cannot disable your own account.']);
    exit;
}

// 3. Determine new status
$newStatus = ($currentStatus === 'active') ? 'disabled' : 'active';

// 4. Safety Check: If disabling an admin, ensure they are not the LAST active admin.
if ($newStatus === 'disabled') {
    $stmt = $conn->prepare("SELECT position FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $targetUser = $result->fetch_assoc();
    $stmt->close();

    if ($targetUser && $targetUser['position'] === 'admin') {
        // Count how many admins are currently ACTIVE
        $countResult = $conn->query("SELECT COUNT(*) as count FROM users WHERE position = 'admin' AND status = 'active'");
        $activeAdmins = $countResult->fetch_assoc()['count'];

        if ($activeAdmins <= 1) {
            echo json_encode(['success' => false, 'message' => 'Cannot disable the last active admin.']);
            $conn->close();
            exit;
        }
    }
}

// 5. Update Database
$stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");
$stmt->bind_param("si", $newStatus, $userId);

if ($stmt->execute()) {
    $action = ($newStatus === 'active') ? 'enabled' : 'disabled';
    echo json_encode(['success' => true, 'message' => "User has been $action."]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}

$stmt->close();
$conn->close();
?>