<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '1');

function check_directory_permissions($dir) {
    if (!file_exists($dir)) {
        return [
            'exists' => false,
            'writable' => false,
            'permissions' => 'Directory does not exist'
        ];
    }
    return [
        'exists' => true,
        'writable' => is_writable($dir),
        'permissions' => substr(sprintf('%o', fileperms($dir)), -4)
    ];
}

try {
    $uploadDir = __DIR__ . '/uploads';
    
    $results = [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'],
        'upload_settings' => [
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'max_execution_time' => ini_get('max_execution_time'),
            'memory_limit' => ini_get('memory_limit'),
            'file_uploads' => ini_get('file_uploads'),
            'max_file_uploads' => ini_get('max_file_uploads'),
            'upload_tmp_dir' => ini_get('upload_tmp_dir')
        ],
        'directory_permissions' => [
            'uploads_dir' => check_directory_permissions($uploadDir),
            'tmp_dir' => check_directory_permissions(sys_get_temp_dir())
        ],
        'database' => [
            'mysql_version' => null,
            'connection_status' => null
        ]
    ];

    // Test database connection
    $conn = new mysqli('localhost', 'root', '', 'verification_files');
    if ($conn->connect_error) {
        $results['database']['connection_status'] = 'Error: ' . $conn->connect_error;
    } else {
        $results['database']['connection_status'] = 'Connected successfully';
        $results['database']['mysql_version'] = $conn->get_server_info();
        
        // Check table
        $tableResult = $conn->query("SHOW TABLES LIKE 'property_verification'");
        $results['database']['table_exists'] = $tableResult->num_rows > 0;
        
        $conn->close();
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Settings check completed',
        'results' => $results
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 