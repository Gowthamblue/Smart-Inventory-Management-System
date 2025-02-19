<?php
include 'db_connection.php';

$query = "SELECT product_id, product_name, order_id, available_stock, price FROM products";
$result = $conn->query($query);

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);

$conn->close();
?>

