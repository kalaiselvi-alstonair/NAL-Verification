<?php
// Prevent direct access
if (!defined('ALLOW_DIRECT_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access is forbidden.');
}

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'verification_files';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    throw new Exception("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset('utf8');
?>
