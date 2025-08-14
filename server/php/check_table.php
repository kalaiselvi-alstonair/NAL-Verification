<?php
// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'verification_files';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get table structure
$result = $conn->query("SHOW TABLES");
if ($result->num_rows > 0) {
    echo "<h2>Tables in database:</h2>";
    while($row = $result->fetch_array()) {
        echo "<h3>Table: " . $row[0] . "</h3>";
        
        // Get columns for this table
        $table = $row[0];
        $columns = $conn->query("SHOW COLUMNS FROM $table");
        
        if ($columns->num_rows > 0) {
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            while($col = $columns->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $col['Field'] . "</td>";
                echo "<td>" . $col['Type'] . "</td>";
                echo "<td>" . $col['Null'] . "</td>";
                echo "<td>" . $col['Key'] . "</td>";
                echo "<td>" . ($col['Default'] ?? 'NULL') . "</td>";
                echo "<td>" . $col['Extra'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }
} else {
    echo "No tables found in the database.";
}

$conn->close();
?>

<style>
table {
    border-collapse: collapse;
    margin-bottom: 20px;
}
th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}
th {
    background-color: #f2f2f2;
}
</style>
