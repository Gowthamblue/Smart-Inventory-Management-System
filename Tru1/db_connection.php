<?php
$conn = new mysqli("localhost", "root", "", "inventory_db2");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
