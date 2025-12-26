<?php
include 'db_connection.php';

$query = "SELECT invoice_id, quantity, total_price, date_time FROM invoice_history ORDER BY date_time DESC";
$result = $conn->query($query);

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode($history);
$conn->close();
?>
