<?php
// --- USER LOGIN SCRIPT ---
// Handles the user login process and session management.

// Start the session to store user data
session_start();

// Include the database connection file
require 'db_connect.php';

// Set the response header to return JSON
header('Content-Type: application/json');

// Get the POST data
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Basic validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter both email and password.']);
    exit;
}

// --- PREPARE AND EXECUTE THE QUERY ---
// Fetch the user from the database based on the email
$stmt = $conn->prepare("SELECT id, full_name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // User found, now verify the password
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // Password is correct, set session variables
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];

        echo json_encode(['success' => true, 'message' => 'Login successful!', 'userName' => $user['full_name']]);
    } else {
        // Incorrect password
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} else {
    // No user found with that email
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
