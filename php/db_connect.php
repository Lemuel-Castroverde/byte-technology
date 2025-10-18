<?php
// --- DATABASE CONNECTION ---
// Establishes a connection to the MySQL database.

// Database credentials
$servername = "localhost"; // Usually "localhost" for XAMPP
$username = "root";        // Default XAMPP username
$password = "";            // Default XAMPP password is empty
$dbname = "byte_tech";   // The name of the database you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // If connection fails, stop the script and show an error.
    die("Connection failed: " . $conn->connect_error);
}
?>
