CREATE TABLE IF NOT EXISTS mpesa_payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  checkout_request_id VARCHAR(255) NOT NULL UNIQUE,
  package_id VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  timestamp VARCHAR(14) NOT NULL,
  status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
  mpesa_receipt_number VARCHAR(255),
  transaction_date VARCHAR(14),
  transaction_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_checkout_request (checkout_request_id),
  INDEX idx_status (status),
  INDEX idx_package (package_id)
); 