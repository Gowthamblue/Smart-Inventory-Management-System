<?php
include 'db_connection.php'; // Include your database connection

// Initialize response array
$response = [
    "totalItems" => 0,
    "lowStockAlerts" => 0,
    "itemsSoldToday" => 0,
    "debug" => [] // Added for debugging
];

try {
    // Fetch total number of items in inventory
    $totalItemsQuery = "SELECT COUNT(*) AS totalItems FROM products";
    $result = $conn->query($totalItemsQuery);
    if ($result && $row = $result->fetch_assoc()) {
        $response["totalItems"] = (int)$row["totalItems"];
    } else {
        $response["debug"][] = "Total items query failed.";
    }

    // Fetch number of products with low stock
    $lowStockQuery = "SELECT COUNT(*) AS lowStockAlerts FROM products WHERE available_stock < 10";
    $result = $conn->query($lowStockQuery);
    if ($result && $row = $result->fetch_assoc()) {
        $response["lowStockAlerts"] = (int)$row["lowStockAlerts"];
    } else {
        $response["debug"][] = "Low stock query failed.";
    }

    // Fetch number of items sold today
    $today = date('Y-m-d');
    $soldTodayQuery = "SELECT COALESCE(SUM(quantity), 0) AS itemsSoldToday FROM billing_history WHERE DATE(date_time) = '$today'";
    $result = $conn->query($soldTodayQuery);
    if ($result && $row = $result->fetch_assoc()) {
        $response["itemsSoldToday"] = (int)$row["itemsSoldToday"];
    } else {
        $response["debug"][] = "Items sold today query failed.";
    }
} catch (Exception $e) {
    $response["error"] = true;
    $response["message"] = $e->getMessage();
    $response["debug"][] = "Exception: " . $e->getMessage();
}

// Close the database connection
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
