<?php
include 'db_connection.php'; // Include database connection

$query = "SELECT * FROM products WHERE available_stock < (total_stock * 0.1)";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    echo "<table border='1'>
            <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Total Stock</th>
                <th>Available Stock</th>
                <th>Action</th>
            </tr>";
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<tr>
        <td>{$row['product_id']}</td>
        <td>{$row['product_name']}</td>
        <td>{$row['total_stock']}</td>
        <td style='color:red;'>{$row['available_stock']}</td>
        <td><button class='restock-btn' data-product-id='{$row['product_id']}' data-product-name='{$row['product_name']}'>Restock Now</button></td>
      </tr>";




    }
    echo "</table>";
} else {
    echo "<h3>✅ All stock levels are sufficient.</h3>";
}
echo "<script>console.log('get_alerts.php loaded');</script>";

?>
