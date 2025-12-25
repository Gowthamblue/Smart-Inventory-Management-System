<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = intval($_POST['product_id']);
    $restock_quantity = intval($_POST['restock_quantity']);

    // Fetch product details (price per unit)
    $query = "SELECT product_name, price FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        $product_name = $product['product_name'];
        $unit_price = $product['price'];
        $total_price = $unit_price * $restock_quantity;

        // Update stock
        $update_query = "UPDATE products SET available_stock = available_stock + ? WHERE product_id = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param("ii", $restock_quantity, $product_id);
        $update_stmt->execute();

        // Insert invoice entry
        $invoice_query = "INSERT INTO invoice_history (product_id, product_name, quantity, total_price) VALUES (?, ?, ?, ?)";
        $invoice_stmt = $conn->prepare($invoice_query);
        $invoice_stmt->bind_param("isid", $product_id, $product_name, $restock_quantity, $total_price);
        $invoice_stmt->execute();

        echo "<script>window.location.href='./FrontEnd/main.html#alerts?restock_success=1';</script>";
        exit();
    } else {
        echo "<script>window.location.href='./FrontEnd/main.html#alerts?restock_success=0';</script>";
        exit();
    }
}
?>
