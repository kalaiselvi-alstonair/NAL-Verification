<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

try {
    // Test database connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Check if table exists
    $result = $conn->query("SHOW TABLES LIKE 'property_verification'");
    
    if ($result->num_rows === 0) {
        throw new Exception("Table 'property_verification' does not exist. Please run setup_database.php first.");
    }

    // Check table structure
    $result = $conn->query("DESCRIBE property_verification");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful and table exists',
        'table_structure' => $columns
    ]);

} catch (Exception $e) {
    error_log("Database test error: " . $e->getMessage());
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