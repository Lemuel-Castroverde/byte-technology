<?php
// Script to add 'status' column to users table
require 'db_connect.php';

$sql = "ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active'";

if ($conn->query($sql) === TRUE) {
    echo "Column 'status' added successfully to users table.";
} else {
    echo "Error adding column: " . $conn->error;
}

$conn->close();
?>
