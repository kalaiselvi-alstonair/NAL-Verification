<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '1');

try {
    $uploadDir = __DIR__ . '/uploads';
    
    // Check if file was uploaded
    if (!isset($_FILES['testfile'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['testfile'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
        ];
        throw new Exception($errors[$file['error']] ?? 'Unknown upload error');
    }

    // Create target path
    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $uploadDir . '/' . $fileName;

    // Try to move the file
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Failed to move uploaded file');
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'File uploaded successfully',
        'file' => [
            'name' => $fileName,
            'size' => $file['size'],
            'type' => $file['type'],
            'path' => $targetPath
        ]
    ]);

} catch (Exception $e) {
    error_log('Upload error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file_data' => isset($_FILES['testfile']) ? $_FILES['testfile'] : null
    ]);
}
?> 