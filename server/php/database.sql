-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `nal_verification`;

-- Use the database
USE `nal_verification`;

-- Create the property_verification table
CREATE TABLE IF NOT EXISTS `property_verification` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `property_type` VARCHAR(50) NOT NULL,
    `owner_name` VARCHAR(255) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `taluk` VARCHAR(100) NOT NULL,
    `kmc_area` VARCHAR(50) NOT NULL,
    `ownership_type` VARCHAR(50) NOT NULL,
    `encumbrance_certificate` LONGBLOB,
    `tax_paid_receipt` LONGBLOB,
    `occupancy_certificate` LONGBLOB,
    `zoning_certificate` LONGBLOB,
    `notes` TEXT,
    `status` ENUM('pending','approved','rejected','flagged') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- If you already have the table, run this in phpMyAdmin to add the status column:
-- ALTER TABLE property_verification ADD COLUMN status ENUM('pending','approved','rejected','flagged') DEFAULT 'pending' AFTER notes;

-- Enable error reporting
SET GLOBAL log_warnings = 1;
SET GLOBAL general_log = 1;
