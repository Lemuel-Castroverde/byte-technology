<?php
// --- USER REGISTRATION SCRIPT ---
require 'db_connect.php';
header('Content-Type: application/json');

$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// --- VALIDATION ---
if (empty($fullName) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// **CRITICAL FIX: EMAIL VALIDATION**
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
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

// --- CHECK IF THIS IS THE FIRST USER ---
$userCountResult = $conn->query("SELECT COUNT(*) as count FROM users");
$userCount = $userCountResult->fetch_assoc()['count'];
$position = ($userCount == 0) ? 'admin' : 'user';

// --- HASH THE PASSWORD ---
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// --- INSERT NEW USER INTO THE DATABASE ---
$stmt = $conn->prepare("INSERT INTO users (full_name, email, password, position) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $fullName, $email, $hashedPassword, $position);

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