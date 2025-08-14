<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '1');

try {
    // Check if uploads directory exists
    $uploadDir = __DIR__ . '/uploads';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    echo json_encode([
        'status' => 'ready',
        'message' => 'Upload form ready',
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'upload_dir_exists' => file_exists($uploadDir),
        'upload_dir_writable' => is_writable($uploadDir)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>

<form action="test_upload_handler.php" method="post" enctype="multipart/form-data">
    <input type="file" name="testfile">
    <input type="submit" value="Upload Test File">
</form> 