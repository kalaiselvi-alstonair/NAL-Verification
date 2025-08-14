<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'server_info' => [
        'document_root' => $_SERVER['DOCUMENT_ROOT'],
        'script_filename' => $_SERVER['SCRIPT_FILENAME'],
        'php_self' => $_SERVER['PHP_SELF'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'server_software' => $_SERVER['SERVER_SOFTWARE'],
        'http_host' => $_SERVER['HTTP_HOST'],
        'script_name' => $_SERVER['SCRIPT_NAME']
    ],
    'file_info' => [
        'current_file' => __FILE__,
        'current_dir' => __DIR__,
        'file_exists' => file_exists(__DIR__ . '/cors.php'),
        'is_readable' => is_readable(__DIR__ . '/cors.php'),
        'absolute_path' => realpath(__DIR__ . '/cors.php')
    ],
    'directory_contents' => scandir(__DIR__)
]);
?> 