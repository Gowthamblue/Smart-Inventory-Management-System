<?php
include 'db_connection.php';

$query = "SELECT billing_id, product_name, quantity, total_price, date_time FROM billing_history ORDER BY date_time DESC";
$result = $conn->query($query);

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode($history);

$conn->close();
?>
