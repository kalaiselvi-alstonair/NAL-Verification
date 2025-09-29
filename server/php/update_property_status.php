<?php
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/status_update_error.log');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['id'], $input['status'])) {
        throw new Exception('Missing id or status');
    }
    $id = intval($input['id']);
    $status = $input['status'];
    $allowed = ['pending', 'approved', 'rejected', 'flagged'];
    if (!in_array($status, $allowed, true)) {
        throw new Exception('Invalid status');
    }
    $conn = new mysqli('localhost', 'root', '', 'nal_verification');
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    // Check if property exists
    $check = $conn->prepare('SELECT id FROM property_verification WHERE id = ?');
    if (!$check) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    $check->bind_param('i', $id);
    $check->execute();
    $result = $check->get_result();
    if ($result->num_rows === 0) {
        throw new Exception('No property found with this id');
    }
    $stmt = $conn->prepare('UPDATE property_verification SET status = ? WHERE id = ?');
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    $stmt->bind_param('si', $status, $id);
    if (!$stmt->execute()) {
        throw new Exception('Failed to update status: ' . $stmt->error);
    }
    echo json_encode(['status' => 'success', 'message' => 'Status updated']);
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?> 