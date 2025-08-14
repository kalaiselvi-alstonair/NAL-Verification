<?php
// Set error reporting to catch all errors
ini_set('display_errors', 0);
error_reporting(0);

// Function to send JSON response and exit
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

// Ensure we have a valid database connection
try {
    require_once 'config.php';
    
    // Check if all required fields are present
    if (!isset($_POST['documentId'], $_FILES['file'], $_POST['fileType'])) {
        throw new Exception('Missing required fields');
    }

    $documentId = filter_var($_POST['documentId'], FILTER_VALIDATE_INT);
    $fileType = trim($_POST['fileType']);
    $file = $_FILES['file'];

    if ($documentId === false || $documentId <= 0) {
        throw new Exception('Invalid document ID');
    }

    // Map client-side file types to database column names
    $fileTypeMap = [
        'ec_document' => 'ec_document',
        'rtc_document' => 'rtc_document',
        'surveyMap_document' => 'survey_map',
        'mutationReport_document' => 'mutation_report',
        'taxReceipt_document' => 'tax_receipt',
        'conversionCertificate_document' => 'conversion_certificate',
        'zoningCertificate_document' => 'zoning_certificate',
        'legalCaseReport_document' => 'legal_case_report'
    ];
    
    // Validate file type and get the database column name
    if (!isset($fileTypeMap[$fileType])) {
        throw new Exception('Invalid document type');
    }
    
    // Get the actual database column name
    $dbColumnName = $fileTypeMap[$fileType];

    // Check for upload errors
    if (!isset($file['error']) || is_array($file['error'])) {
        throw new Exception('Invalid file parameters');
    }

    switch ($file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new Exception('File is too large. Maximum size is 5MB');
        case UPLOAD_ERR_PARTIAL:
            throw new Exception('The uploaded file was only partially uploaded');
        case UPLOAD_ERR_NO_FILE:
            throw new Exception('No file was uploaded');
        default:
            throw new Exception('File upload error');
    }

    // Check file size (limit to 5MB)
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxFileSize) {
        throw new Exception('File is too large. Maximum size is 5MB');
    }

    // Verify the file was actually uploaded via HTTP POST
    if (!is_uploaded_file($file['tmp_name'])) {
        throw new Exception('Possible file upload attack');
    }

    // Read the file content
    $fileContent = file_get_contents($file['tmp_name']);
    if ($fileContent === false) {
        throw new Exception('Failed to read file');
    }

    // Check if document exists
    $stmt = $conn->prepare("SELECT id FROM propertydocuments WHERE id = ?");
    if ($stmt === false) {
        throw new Exception('Database error: ' . $conn->error);
    }
    
    $stmt->bind_param("i", $documentId);
    if (!$stmt->execute()) {
        throw new Exception('Database error: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    if ($result === false) {
        throw new Exception('Database error: ' . $stmt->error);
    }

    if ($result->num_rows === 0) {
        $stmt->close();
        throw new Exception('Document not found');
    }
    $stmt->close();

    // Update the document with the file data
    $stmt = $conn->prepare("UPDATE propertydocuments SET `$dbColumnName` = ? WHERE id = ?");
    if ($stmt === false) {
        throw new Exception('Database error: ' . $conn->error);
    }
    
    $null = null;
    $stmt->bind_param("bi", $null, $documentId);
    $stmt->send_long_data(0, $fileContent);

    if (!$stmt->execute()) {
        $error = $stmt->error;
        $stmt->close();
        throw new Exception('Error updating database: ' . $error);
    }
    
    $stmt->close();
    
    sendJsonResponse([
        'success' => true,
        'message' => 'File uploaded successfully',
        'documentId' => $documentId,
        'fileType' => $fileType
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log('Upload error: ' . $e->getMessage());
    
    // Send JSON response
    sendJsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 400);
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}

?>
