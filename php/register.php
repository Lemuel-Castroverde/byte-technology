<?php
// --- USER REGISTRATION SCRIPT ---
require 'db_connect.php';
header('Content-Type: application/json');

$fullName = $_POST['fullName'] ?? '';
$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// --- VALIDATION ---
if (empty($fullName) || empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// 1. Validate Full Name (No numbers, only letters, spaces, -, ', .)
if (!preg_match("/^[a-zA-Z\s\-\'.]+$/", $fullName)) {
    echo json_encode(['success' => false, 'message' => 'Full Name contains invalid characters or numbers.']);
    exit;
}

// 2. Validate Username (No spaces)
if (preg_match('/\s/', $username)) {
    echo json_encode(['success' => false, 'message' => 'Username cannot contain spaces.']);
    exit;
}

// 3. Validate Email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// 4. Validate Password
if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
    exit;
}

// --- CHECK IF EMAIL OR USERNAME ALREADY EXISTS ---
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'An account with this email or username already exists.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// --- CHECK IF THIS IS THE FIRST USER ---
$userCountResult = $conn->query("SELECT COUNT(*) as count FROM users");
$userCount = $userCountResult->fetch_assoc()['count'];
$position = ($userCount == 0) ? 'admin' : 'user';

// --- HASH THE PASSWORD ---
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// --- INSERT NEW USER INTO THE DATABASE ---
$stmt = $conn->prepare("INSERT INTO users (full_name, username, email, password, position) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $fullName, $username, $email, $hashedPassword, $position);

if ($stmt->execute()) {
    $message = 'Account created successfully! You can now log in.';
    if ($position === 'admin') {
        $message .= ' (You have been registered as the first Admin).';
    }
    echo json_encode(['success' => true, 'message' => $message]);
} else {
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again.']);
}

$stmt->close();
$conn->close();
?>