<?php
// Prevent any output before headers
ob_start();

// Disable error display but log them
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

function sendJsonResponse($status, $message, $data = null, $statusCode = 200) {
    if (ob_get_length()) ob_clean();
    header('Access-Control-Allow-Origin: http://localhost:3001');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
    header('Content-Type: application/json');
    http_response_code($statusCode);
    $response = [
        'status' => $status,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit();
}

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error: [$errno] $errstr in $errfile on line $errline");
    sendJsonResponse('error', 'Internal server error', null, 500);
});

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        sendJsonResponse('success', 'Preflight OK');
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJsonResponse('error', 'Method not allowed. Only POST requests are accepted.', null, 405);
    }
    error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
    error_log("POST data: " . print_r($_POST, true));
    error_log("FILES data: " . print_r($_FILES, true));

    $requiredFields = ['propertyType', 'ownerName', 'state', 'district', 'taluk', 'authority', 'ownershipType'];
    $missingFields = [];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $missingFields[] = $field;
        }
    }
    if (!empty($missingFields)) {
        sendJsonResponse('error', "Missing required fields: " . implode(', ', $missingFields), null, 400);
    }

    // Connect to nal_verification database
    $conn = new mysqli('localhost', 'root', '', 'nal_verification');
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Read files as BLOBs
    function getFileBlob($key) {
        return (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK)
            ? file_get_contents($_FILES[$key]['tmp_name']) : null;
    }

    $ecBlob = getFileBlob('ec');
    $taxBlob = getFileBlob('tax');
    $ocBlob = getFileBlob('oc');
    $zoningBlob = getFileBlob('zoning');

    $propertyType = $_POST['propertyType'];
    $ownerName = $_POST['ownerName'];
    $state = $_POST['state'];
    $district = $_POST['district'];
    $taluk = $_POST['taluk'];
    $authority = $_POST['authority'];
    $ownershipType = $_POST['ownershipType'];
    $notes = isset($_POST['notes']) ? $_POST['notes'] : '';

    $stmt = $conn->prepare("
        INSERT INTO property_verification 
        (property_type, owner_name, state, district, taluk, kmc_area, ownership_type,
        encumbrance_certificate, tax_paid_receipt, occupancy_certificate, zoning_certificate,
        notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    $stmt->send_long_data(7, $ecBlob);
    $stmt->send_long_data(8, $taxBlob);
    $stmt->send_long_data(9, $ocBlob);
    $stmt->send_long_data(10, $zoningBlob);
    if (!$stmt->bind_param(
        "ssssssssssss",
        $propertyType,
        $ownerName,
        $state,
        $district,
        $taluk,
        $authority,
        $ownershipType,
        $ecBlob,
        $taxBlob,
        $ocBlob,
        $zoningBlob,
        $notes
    )) {
        throw new Exception("Parameter binding failed: " . $stmt->error);
    }
    if (!$stmt->execute()) {
        throw new Exception("Query execution failed: " . $stmt->error);
    }
    $insertId = $stmt->insert_id;
    sendJsonResponse('success', 'Property verification submitted successfully', [
        'id' => $insertId
    ]);

} catch (Throwable $e) {
    error_log("Error in cors.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    sendJsonResponse('error', $e->getMessage(), null, 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 