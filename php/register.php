<?php
// --- USER REGISTRATION SCRIPT ---
// Handles the user signup process.

// Include the database connection file
require 'db_connect.php';

// Set the response header to return JSON
header('Content-Type: application/json');

// Get the POST data from the form
$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// --- VALIDATION ---
if (empty($fullName) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
    exit;
}

// --- CHECK IF EMAIL ALREADY EXISTS ---
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// --- HASH THE PASSWORD ---
// Use PHP's built-in function for secure password hashing
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// --- INSERT NEW USER INTO THE DATABASE ---
$stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $fullName, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Account created successfully! You can now log in.']);
} else {
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again.']);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
