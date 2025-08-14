<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
    $conn = new mysqli('localhost', 'root', '', 'nal_verification');
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    $result = $conn->query('SELECT id, property_type, owner_name, state, district, taluk, kmc_area, ownership_type, notes, created_at FROM property_verification ORDER BY created_at DESC');
    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }

    $verifications = [];
    while ($row = $result->fetch_assoc()) {
        $verifications[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'data' => $verifications
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 