<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = intval($_POST['product_id']);
    $quantity = intval($_POST['quantity']);

    $conn->begin_transaction();

    try {
        $product_query = "SELECT product_name, price, available_stock FROM products WHERE product_id = ?";
        $stmt = $conn->prepare($product_query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $product = $result->fetch_assoc();

            if ($product['available_stock'] >= $quantity) {
                $total_price = $product['price'] * $quantity;

                $new_stock = $product['available_stock'] - $quantity;
                $update_stock_query = "UPDATE products SET available_stock = ? WHERE product_id = ?";
                $update_stmt = $conn->prepare($update_stock_query);
                $update_stmt->bind_param("ii", $new_stock, $product_id);
                $update_stmt->execute();

                $billing_query = "INSERT INTO billing_history (product_id, product_name, quantity, total_price, date_time) VALUES (?, ?, ?, ?, NOW())";
                $billing_stmt = $conn->prepare($billing_query);
                $billing_stmt->bind_param("isid", $product_id, $product['product_name'], $quantity, $total_price);                
                $billing_stmt->execute();

                $conn->commit();
                echo "Billing successful! Total Price: ₹" . $total_price . ". Remaining Stock: " . $new_stock . ".";
            } else {
                throw new Exception("Insufficient stock for Product ID: " . $product_id);
            }
        } else {
            throw new Exception("Product not found.");
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo "Error: " . $e->getMessage();
    }


    $stmt->close();
    $conn->close();
}
?>
