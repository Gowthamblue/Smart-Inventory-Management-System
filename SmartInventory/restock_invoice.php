<?php
$product_id = isset($_GET['product_id']) ? $_GET['product_id'] : '';
$product_name = isset($_GET['product_name']) ? $_GET['product_name'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Restock Invoice</title>
</head>
<body>
    <h2>Restock Invoice</h2>
    <form action="process_restock.php" method="POST">
        <label>Product Id:</label>
        <input type="text" name="product_name" value="<?= $product_id ?>" readonly>
        <label>Product Name:</label>
        <input type="text" name="product_name" value="<?= $product_name ?>" readonly>
        <label>Restock Quantity:</label>
        <input type="number" name="restock_quantity" required>
        <input type="hidden" name="product_id" value="<?= $product_id ?>">
        <button type="submit">Generate Invoice</button>
    </form>
</body>
</html>
