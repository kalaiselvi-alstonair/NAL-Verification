<?php
// Set CORS headers to allow requests from localhost:3001
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once 'config.php';

function getFile($key) {
    return isset($_FILES[$key]) ? file_get_contents($_FILES[$key]['tmp_name']) : NULL;
}

try {
    $propertyType = $_POST['propertyType'] ?? '';
    $ownerName = $_POST['ownerName'] ?? '';
    $state = $_POST['state'] ?? '';
    $district = $_POST['district'] ?? '';
    $taluk = $_POST['taluk'] ?? '';
    $authority = $_POST['authority'] ?? '';
    $ownershipType = $_POST['ownershipType'] ?? '';
    $notes = $_POST['notes'] ?? '';

    $stmt = $conn->prepare("
    INSERT INTO property_verification 
    (property_type, owner_name, state, district, taluk, kmc_area, ownership_type, 
    encumbrance_certificate, encumbrance_certificate_name, tax_paid_receipt, tax_paid_receipt_name,
    occupancy_certificate, occupancy_certificate_name, zoning_certificate, zoning_certificate_name,
    notes, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssssssssssssssss",
        $propertyType, $ownerName, $state, $district, $taluk, $authority, $ownershipType,
        getFile('ec'), $_POST['ec_name'] ?? '',
        getFile('tax'), $_POST['tax_name'] ?? '',
        getFile('oc'), $_POST['oc_name'] ?? '',
        getFile('zoning'), $_POST['zoning_name'] ?? '',
        $notes
    );

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Property verification submitted successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 