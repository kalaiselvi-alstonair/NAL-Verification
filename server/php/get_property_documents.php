<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

try {
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception('Missing or invalid property id');
    }
    $id = intval($_GET['id']);
    $conn = new mysqli('localhost', 'root', '', 'nal_verification');
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    // REMOVE status from the query below!
    $stmt = $conn->prepare('SELECT id, property_type, owner_name, state, district, taluk, kmc_area, ownership_type, notes, created_at, encumbrance_certificate, tax_paid_receipt, occupancy_certificate, zoning_certificate FROM property_verification WHERE id = ?');
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) {
        throw new Exception('Query failed: ' . $stmt->error);
    }
    if ($result->num_rows === 0) {
        throw new Exception('No property found with this id');
    }
    $row = $result->fetch_assoc();
    // Convert BLOBs to base64 if not null
    foreach (['encumbrance_certificate', 'tax_paid_receipt', 'occupancy_certificate', 'zoning_certificate'] as $field) {
        $row[$field] = isset($row[$field]) && !is_null($row[$field]) ? base64_encode($row[$field]) : null;
    }
    echo json_encode([
        'status' => 'success',
        'data' => $row
    ]);
    $stmt->close();
    $conn->close();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
    if (!isset($_GET['id'])) {
        throw new Exception('Missing property id');
    }
    $id = intval($_GET['id']);
    $conn = new mysqli('localhost', 'root', '', 'nal_verification');
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    $stmt = $conn->prepare('SELECT encumbrance_certificate, tax_paid_receipt, occupancy_certificate, zoning_certificate FROM property_verification WHERE id = ?');
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        throw new Exception('No property found with this id');
    }
    $stmt->bind_result($ec, $tax, $oc, $zoning);
    $stmt->fetch();
    $docs = [
        'encumbrance_certificate' => $ec ? base64_encode($ec) : null,
        'tax_paid_receipt' => $tax ? base64_encode($tax) : null,
        'occupancy_certificate' => $oc ? base64_encode($oc) : null,
        'zoning_certificate' => $zoning ? base64_encode($zoning) : null,
    ];
    echo json_encode([
        'status' => 'success',
        'data' => $docs
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 