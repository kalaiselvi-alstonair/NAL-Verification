<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $uploadDir = __DIR__ . '/uploads';
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("Failed to create uploads directory");
        }
        chmod($uploadDir, 0777);
    }

    // Test write permissions by creating a test file
    $testFile = $uploadDir . '/test.txt';
    if (!file_put_contents($testFile, 'Test write access')) {
        throw new Exception("Cannot write to uploads directory");
    }
    unlink($testFile); // Clean up test file

    echo json_encode([
        'status' => 'success',
        'message' => 'Uploads directory created and writable',
        'path' => $uploadDir,
        'permissions' => substr(sprintf('%o', fileperms($uploadDir)), -4)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 