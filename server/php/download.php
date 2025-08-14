<?php
require_once 'config.php';

// Map fileType to DB column
$fileTypeMap = [
    'ec_document' => 'ec_document',
    'rtc_document' => 'rtc_document',
    'surveyMap_document' => 'survey_map',
    'mutationReport_document' => 'mutation_report',
    'taxReceipt_document' => 'tax_receipt',
    'conversionCertificate_document' => 'conversion_certificate',
    'zoningCertificate_document' => 'zoning_certificate',
    'legalCaseReport_document' => 'legal_case_report',
];

// Validate input
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$fileType = isset($_GET['fileType']) ? $_GET['fileType'] : '';

if ($id <= 0 || !isset($fileTypeMap[$fileType])) {
    http_response_code(400);
    echo 'Invalid parameters.';
    exit;
}

$column = $fileTypeMap[$fileType];

// Fetch file from DB
$stmt = $conn->prepare("SELECT `$column` FROM propertydocuments WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    http_response_code(404);
    echo 'File not found.';
    exit;
}

$stmt->bind_result($fileData);
$stmt->fetch();
$stmt->close();
$conn->close();

if (!$fileData) {
    http_response_code(404);
    echo 'No file uploaded for this type.';
    exit;
}

// Set headers for download
header('Content-Description: File Transfer');
header('Content-Type: application/pdf'); // You can adjust this if you store other types
header('Content-Disposition: attachment; filename="' . $fileType . '_' . $id . '.pdf"');
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . strlen($fileData));

echo $fileData;
exit; 