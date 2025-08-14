<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';

try {
    echo json_encode(['status' => 'info', 'message' => 'Starting database setup...']);
    
    // Create connection without database
    $conn = new mysqli($db_host, $db_user, $db_pass);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo json_encode(['status' => 'info', 'message' => 'Connected to MySQL server']);

    // Create database if not exists
    $sql = "CREATE DATABASE IF NOT EXISTS verification_files";
    if (!$conn->query($sql)) {
        throw new Exception("Error creating database: " . $conn->error);
    }
    echo json_encode(['status' => 'info', 'message' => 'Database created or already exists']);

    // Select the database
    if (!$conn->select_db('verification_files')) {
        throw new Exception("Error selecting database: " . $conn->error);
    }
    echo json_encode(['status' => 'info', 'message' => 'Selected database']);

    // Drop existing table if exists
    $sql = "DROP TABLE IF EXISTS property_verification";
    if (!$conn->query($sql)) {
        throw new Exception("Error dropping existing table: " . $conn->error);
    }
    echo json_encode(['status' => 'info', 'message' => 'Dropped existing table if any']);

    // Create table
    $sql = "CREATE TABLE property_verification (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_type VARCHAR(50) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        state VARCHAR(50) NOT NULL,
        district VARCHAR(100) NOT NULL,
        taluk VARCHAR(100) NOT NULL,
        kmc_area VARCHAR(50) NOT NULL,
        ownership_type VARCHAR(50) NOT NULL,
        encumbrance_certificate VARCHAR(255),
        tax_paid_receipt VARCHAR(255),
        occupancy_certificate VARCHAR(255),
        zoning_certificate VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    if (!$conn->query($sql)) {
        throw new Exception("Error creating table: " . $conn->error);
    }
    echo json_encode(['status' => 'info', 'message' => 'Table created successfully']);

    // Verify table exists
    $result = $conn->query("SHOW TABLES LIKE 'property_verification'");
    if ($result->num_rows === 0) {
        throw new Exception("Table was not created successfully");
    }

    // Verify table structure
    $result = $conn->query("DESCRIBE property_verification");
    if ($result->num_rows === 0) {
        throw new Exception("Table structure is invalid");
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Database and table created successfully',
        'details' => 'Table property_verification is ready to use'
    ]);

} catch (Exception $e) {
    error_log("Database setup error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 