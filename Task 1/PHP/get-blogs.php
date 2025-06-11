<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include 'db.php';
$result = $conn->query("SELECT * FROM blogs ORDER BY created_at DESC");
$blogs = [];
while ($row = $result->fetch_assoc()) {
    $blogs[] = $row;
}
echo json_encode($blogs);
?>