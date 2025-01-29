<?php
include 'db_connection.php'; // Include your database connection

// Initialize response array
$response = [
    "totalItems" => 0,
    "lowStockAlerts" => 0,
    "itemsSoldToday" => 0
];

try {
    // Fetch total number of items in inventory
    $totalItemsQuery = "SELECT COUNT(*) AS totalItems FROM products";
    $result = $conn->query($totalItemsQuery);
    if ($result && $row = $result->fetch_assoc()) {
        $response["totalItems"] = (int)$row["totalItems"];
    }

    // Fetch number of products with low stock
    $lowStockQuery = "SELECT COUNT(*) AS lowStockAlerts FROM products WHERE available_stock < 10";
    $result = $conn->query($lowStockQuery);
    if ($result && $row = $result->fetch_assoc()) {
        $response["lowStockAlerts"] = (int)$row["lowStockAlerts"];
    }

    // Fetch number of items sold today
    $today = date('Y-m-d');
    $soldTodayQuery = "SELECT COALESCE(SUM(quantity), 0) AS itemsSoldToday FROM billing_history WHERE DATE(date_time) = ?";
    $stmt = $conn->prepare($soldTodayQuery);
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $response["itemsSoldToday"] = (int)$row["itemsSoldToday"];
    }

} catch (Exception $e) {
    error_log("Dashboard Data Error: " . $e->getMessage());
    $response["error"] = "Error fetching dashboard data.";
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
