<?php
// --- SUBMIT ORDER SCRIPT ---
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

// Get the raw POST data from the fetch request
$data = json_decode(file_get_contents('php://input'), true);

// 1. --- EXTRACT DATA ---
$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$address = $data['address'] ?? '';
$contactNumber = $data['contactNumber'] ?? '';
$paymentMethod = $data['paymentMethod'] ?? '';
$cart = $data['cart'] ?? [];

// Get the logged-in user's ID, or NULL if they are a guest
$userId = $_SESSION['user_id'] ?? null;

// 2. --- VALIDATION ---
if (empty($fullName) || empty($email) || empty($address) || empty($contactNumber) || empty($paymentMethod)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}
if (empty($cart)) {
    echo json_encode(['success' => false, 'message' => 'Your cart is empty.']);
    exit;
}

// 3. --- SERVER-SIDE TOTAL CALCULATION (SECURITY) ---
// Never trust the total sent from the client.
// We must get the prices from our database.
$totalAmount = 0;
$productIds = [];
foreach ($cart as $item) {
    $productIds[] = $item['id'];
}
$idList = implode(',', $productIds);
$stmt = $conn->prepare("SELECT id, price FROM products WHERE id IN ($idList)");
$stmt->execute();
$result = $stmt->get_result();
$dbProducts = [];
while ($row = $result->fetch_assoc()) {
    $dbProducts[$row['id']] = $row['price'];
}
$stmt->close();

// Calculate total and build a "safe" cart for insertion
$safeCart = [];
foreach ($cart as $item) {
    $productId = $item['id'];
    if (isset($dbProducts[$productId])) {
        $dbPrice = $dbProducts[$productId];
        $totalAmount += $dbPrice * $item['quantity'];
        
        // Add to our safe cart to use for 'order_items'
        $safeCart[] = [
            'id' => $productId,
            'name' => $item['name'], // Name is less critical, but price must be from DB
            'quantity' => $item['quantity'],
            'price' => $dbPrice
        ];
    } else {
        // Product in cart doesn't exist in DB. Abort.
        echo json_encode(['success' => false, 'message' => "An item in your cart (ID: $productId) is no longer available."]);
        $conn->close();
        exit;
    }
}


// 4. --- DATABASE TRANSACTION ---
// Use a transaction so if one part fails, the whole order is cancelled.
$conn->begin_transaction();

try {
    // A. Insert into 'orders' table
    $stmt_order = $conn->prepare(
        "INSERT INTO orders (user_id, total_amount, full_name, email, shipping_address, contact_number, payment_method, order_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'Pending')"
    );
    $stmt_order->bind_param("idsssss", $userId, $totalAmount, $fullName, $email, $address, $contactNumber, $paymentMethod);
    $stmt_order->execute();
    
    // Get the new order's ID
    $orderId = $conn->insert_id;
    $stmt_order->close();

    // B. Insert each item into 'order_items' table
    $stmt_items = $conn->prepare(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) 
         VALUES (?, ?, ?, ?, ?)"
    );
    
    foreach ($safeCart as $item) {
        $stmt_items->bind_param("iisid", $orderId, $item['id'], $item['name'], $item['quantity'], $item['price']);
        $stmt_items->execute();
    }
    $stmt_items->close();

    // C. If all successful, commit the transaction
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Order placed successfully!']);

} catch (Exception $e) {
    // D. If anything failed, roll back
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'An error occurred while placing your order. Please try again.']);
}

$conn->close();
?>