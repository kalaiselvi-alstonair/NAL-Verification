<?php
// Allow CORS from any localhost port for development
if (isset($_SERVER['HTTP_ORIGIN']) && preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$db = 'nal_verification';
$user = 'root';
$password = '';

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Collect filters from GET or POST
$survey_number = $_GET['survey_number'] ?? $_POST['survey_number'] ?? '';
$owner_name = $_GET['owner_name'] ?? $_POST['owner_name'] ?? '';
$village_area = $_GET['village_area'] ?? $_POST['village_area'] ?? '';
$state = $_GET['state'] ?? $_POST['state'] ?? '';

$where = [];
$params = [];
$types = '';

if ($survey_number !== '') {
    $where[] = "survey_number LIKE ?";
    $params[] = "%$survey_number%";
    $types .= 's';
}
if ($owner_name !== '') {
    $where[] = "owner_name LIKE ?";
    $params[] = "%$owner_name%";
    $types .= 's';
}
if ($village_area !== '') {
    $where[] = "village_area LIKE ?";
    $params[] = "%$village_area%";
    $types .= 's';
}
if ($state !== '') {
    $where[] = "state LIKE ?";
    $params[] = "%$state%";
    $types .= 's';
}

$sql = "SELECT id, owner_name, survey_number, village_area, state FROM propertydocuments";
if ($where) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY id DESC";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'error' => 'SQL prepare failed: ' . $conn->error, 'sql' => $sql]);
    $conn->close();
    exit;
}
if ($where) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$documents = [];
while ($row = $result->fetch_assoc()) {
    $documents[] = $row;
}

echo json_encode(['success' => true, 'documents' => $documents]);
$stmt->close();
$conn->close();
?> 