<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

include 'db.php';

$stmt = $conn->prepare("SELECT password FROM admins WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    $_SESSION['admin'] = $username;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
}
?>