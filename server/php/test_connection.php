<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
    $results = [];
    
    // Test database connection
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'verification_files';

    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    $results['database'] = "Connected successfully to database";

    // Test table existence
    $result = $conn->query("SHOW TABLES LIKE 'property_verification'");
    if ($result->num_rows === 0) {
        throw new Exception("Table 'property_verification' does not exist");
    }
    $results['table'] = "Table exists and is accessible";

    // Test uploads directory
    $uploadDir = __DIR__ . '/uploads';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("Failed to create uploads directory");
        }
    }
    if (!is_writable($uploadDir)) {
        throw new Exception("Uploads directory is not writable");
    }
    $results['uploads'] = "Uploads directory is ready and writable";

    // Test file write
    $testFile = $uploadDir . '/test.txt';
    if (file_put_contents($testFile, 'Test write access')) {
        unlink($testFile); // Clean up
        $results['file_write'] = "File write test successful";
    } else {
        throw new Exception("Cannot write to uploads directory");
    }

    // Return all test results
    echo json_encode([
        'status' => 'success',
        'message' => 'All tests passed',
        'tests' => $results
    ]);

} catch (Exception $e) {
    error_log("Test connection error: " . $e->getMessage());
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