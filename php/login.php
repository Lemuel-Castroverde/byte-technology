<?php
// --- USER LOGIN SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$loginIdentifier = $_POST['loginIdentifier'] ?? ''; // <-- UPDATED
$password = $_POST['password'] ?? '';

// Basic validation
if (empty($loginIdentifier) || empty($password)) { // <-- UPDATED
    echo json_encode(['success' => false, 'message' => 'Please enter both email/username and password.']);
    exit;
}

// --- PREPARE AND EXECUTE THE QUERY ---
// Find a user where the email OR the username matches the identifier
$stmt = $conn->prepare("SELECT id, full_name, email, password, position FROM users WHERE email = ? OR username = ?"); // <-- UPDATED
$stmt->bind_param("ss", $loginIdentifier, $loginIdentifier); // <-- UPDATED
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // Password is correct, set session variables
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['email'] = $user['email']; 
        $_SESSION['position'] = $user['position'];

        echo json_encode([
            'success' => true, 
            'message' => 'Login successful!', 
            'userName' => $user['full_name'],
            'position' => $user['position'] 
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials.']); // <-- Generic Message
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials.']); // <-- Generic Message
}

$stmt->close();
$conn->close();
?>