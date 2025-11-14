<?php
// --- USER LOGIN SCRIPT ---
// Handles the user login process and session management.

session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Basic validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter both email and password.']);
    exit;
}

// Email Validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// --- PREPARE AND EXECUTE THE QUERY ---
$stmt = $conn->prepare("SELECT id, full_name, email, password, position FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // Password is correct, set session variables
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['email'] = $user['email']; // <--- NEW: Store email in session
        $_SESSION['position'] = $user['position'];

        echo json_encode([
            'success' => true, 
            'message' => 'Login successful!', 
            'userName' => $user['full_name'],
            'position' => $user['position'] 
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}

$stmt->close();
$conn->close();
?>