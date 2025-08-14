<?php
require_once 'config.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Get the requested endpoint and handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(200);
    exit();
}

// Get the requested endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Get JSON input for POST requests
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGetRequest($endpoint, $conn);
        break;
    case 'POST':
        handlePostRequest($endpoint, $conn, $input);
        break;
    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}

// Close the database connection
$conn->close();

/**
 * Handle GET requests
 */
function handleGetRequest($endpoint, $conn) {
    switch ($endpoint) {
        case 'files':
            getFiles($conn);
            break;
        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
            break;
    }
}

/**
 * Handle POST requests
 */
function handlePostRequest($endpoint, $conn, $data) {
    switch ($endpoint) {
        case 'files':
            // First create the document entry
            $documentId = createDocument($conn, $data);
            if ($documentId === false) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Failed to create document']);
                return;
            }
            
            echo json_encode([
                'success' => true,
                'documentId' => $documentId,
                'message' => 'Document created successfully. Please upload files.'
            ]);
            break;
        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
            break;
    }
}

function createDocument($conn, $data) {
    $requiredFields = ['ownerName', 'surveyNumber', 'villageArea', 'state'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            return false;
        }
    }

    $sql = "INSERT INTO propertydocuments (owner_name, survey_number, village_area, state) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", 
        $data['ownerName'],
        $data['surveyNumber'],
        $data['villageArea'],
        $data['state']
    );
    
    if ($stmt->execute()) {
        return $stmt->insert_id;
    }
    return false;
}

/**
 * Get all property documents from the database
 */
function getFiles($conn) {
    // Select only non-binary fields for listing
    $sql = "SELECT id, owner_name as ownerName, survey_number as surveyNumber, 
            village_area as villageArea, state, created_at as createdAt, 
            updated_at as updatedAt 
            FROM propertydocuments 
            ORDER BY created_at DESC";
            
    $result = $conn->query($sql);

    if ($result) {
        $documents = [];
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        echo json_encode([
            'success' => true,
            'documents' => $documents
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error fetching documents: ' . $conn->error
        ]);
    }
}

/**
 * Add a new property document to the database
 */
function addFile($conn, $data) {
    // Validate required fields
    $required = ['surveyNumber', 'ownerName', 'villageArea', 'state'];
    $missing = [];
    
    foreach ($required as $field) {
        if (empty($data[$field])) {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ]);
        return;
    }
    
    // Check if document with this survey number already exists
    $checkStmt = $conn->prepare("SELECT id FROM PropertyDocuments WHERE survey_number = ?");
    $checkStmt->bind_param("s", $data['surveyNumber']);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        http_response_code(409);
        echo json_encode([
            'status' => 'error',
            'message' => 'A document with this survey number already exists'
        ]);
        $checkStmt->close();
        return;
    }
    $checkStmt->close();
    
    // Prepare the SQL query
    $sql = "INSERT INTO PropertyDocuments (
        owner_name, 
        survey_number, 
        village_area, 
        state
    ) VALUES (?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", 
        $data['ownerName'],
        $data['surveyNumber'],
        $data['villageArea'],
        $data['state']
    );
    
    // Execute the statement
    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Property document added successfully',
            'id' => $newId
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error adding property document: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
}

/**
 * Handle file uploads for documents
 */
function handleFileUpload($conn, $documentId, $fileType, $fileData) {
    // Validate document ID
    $checkStmt = $conn->prepare("SELECT id FROM PropertyDocuments WHERE id = ?");
    $checkStmt->bind_param("i", $documentId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Document not found'
        ]);
        $checkStmt->close();
        return;
    }
    $checkStmt->close();
    
    // Validate file type
    $allowedTypes = [
        'ec_document',
        'rtc_document',
        'survey_map',
        'mutation_report',
        'tax_receipt',
        'conversion_certificate',
        'zoning_certificate',
        'legal_case_report'
    ];
    
    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid document type'
        ]);
        return;
    }
    
    // Update the document with the file data
    $stmt = $conn->prepare("UPDATE PropertyDocuments SET $fileType = ? WHERE id = ?");
    $null = null;
    $stmt->bind_param("bi", $null, $documentId);
    $stmt->send_long_data(0, $fileData);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'File uploaded successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error uploading file: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
}
?>
