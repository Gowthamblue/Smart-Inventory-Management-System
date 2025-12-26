<?php
$conn = new mysqli("127.0.0.1", "root", "Mysql@104050", "smart_inventory",3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
