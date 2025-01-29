<?php
include 'db_connection.php';

// SQL query to fetch low stock alerts
$sql = "SELECT product_name, available_stock, threshold, alert_date FROM alerts WHERE available_stock <= threshold";
$result = $conn->query($sql);

// Check if there are any results
if ($result->num_rows > 0) {
    // Output table rows with alert data
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['product_name']) . "</td>";
        echo "<td>" . htmlspecialchars($row['available_stock']) . "</td>";
        echo "<td>" . htmlspecialchars($row['threshold']) . "</td>";
        echo "<td>" . htmlspecialchars($row['alert_date']) . "</td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='4'>No low stock alerts found.</td></tr>";
}

// Close the database connection
$conn->close();
?>
