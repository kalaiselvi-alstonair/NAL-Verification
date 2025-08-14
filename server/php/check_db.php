<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    // Check if table exists
    $result = $conn->query("SHOW TABLES LIKE 'property_verification'");
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Database and table are properly configured',
            'table_exists' => true
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Table property_verification does not exist',
            'table_exists' => false
        ]);
    }
} catch (Exception $e) {
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