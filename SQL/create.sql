-- Services
CREATE TABLE IF NOT EXISTS `services` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NULL UNIQUE,
    service_price VARCHAR(255) NULL,
    is_active TINYINT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Employees
CREATE TABLE IF NOT EXISTS `employees` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_name LONGTEXT NULL,
    employee_father_name LONGTEXT NULL,
    employee_mobile_number VARCHAR(255) NULL UNIQUE,
    employee_whatsapp_number VARCHAR(255) NULL UNIQUE,
    employee_eid_number VARCHAR(255) NULL UNIQUE,
    employee_eid_issue_date VARCHAR(255) NULL,
    employee_eid_expiry_date VARCHAR(255) NULL,
    employee_passport_number VARCHAR(255) NULL UNIQUE,
    employee_passport_issue_date VARCHAR(255) NULL,
    employee_passport_expiry_date VARCHAR(255) NULL,
    employee_nationality VARCHAR(255) NULL,
    employee_date_of_birth TIMESTAMP NULL,
    employee_visa_status VARCHAR(255) DEFAULT 'employment',
    employee_visa_issue_date TIMESTAMP NULL DEFAULT NULL,
    employee_visa_expiry_date TIMESTAMP NULL DEFAULT NULL,
    employee_salary_type VARCHAR(255) DEFAULT 'commission',
    employee_salary_target VARCHAR(255) DEFAULT '6000',
    employee_salary_fixed VARCHAR(255) DEFAULT '1300',
    employee_salary_percentage VARCHAR(255) DEFAULT '40',
    is_active TINYINT NULL DEFAULT 0,
    employee_joining_date TIMESTAMP NULL,
    employee_leaving_date TIMESTAMP NULL,
    employee_description LONGTEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);

-- Order Header
CREATE TABLE IF NOT EXISTS `order_header` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NULL,
    payment_type VARCHAR(255) NULL,
    payable_amount VARCHAR(255) NULL,
    amount_collected VARCHAR(255) NULL,
    balance_amount VARCHAR(255) NULL,
    order_status VARCHAR(255) DEFAULT 'open',
    order_amendment_status VARCHAR(255) DEFAULT 'original',
    order_remarks LONGTEXT DEFAULT NULL,
    order_closed_at TIMESTAMP NULL,
    amount_collected_by_owner TINYINT NULL DEFAULT 0,
    amount_collected_by_id INT NULL,
    amount_collected_by_owner_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Order Header History
CREATE TABLE IF NOT EXISTS `order_header_history` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    employee_id INT NULL,
    payment_type VARCHAR(255) NULL,
    payable_amount VARCHAR(255) NULL,
    amount_collected VARCHAR(255) NULL,
    balance_amount VARCHAR(255) NULL,
    order_status VARCHAR(255) DEFAULT 'open',
    order_amendment_status VARCHAR(255) DEFAULT NULL,
    order_remarks LONGTEXT DEFAULT NULL,
    order_closed_at TIMESTAMP NULL,
    amount_collected_by_owner TINYINT NULL DEFAULT 0,
    amount_collected_by_id INT NULL,
    amount_collected_by_owner_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);

-- Order Details
CREATE TABLE IF NOT EXISTS `order_details` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_header_id INT NULL,
    service_id INT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Order Details History
CREATE TABLE IF NOT EXISTS `order_details_history` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_header_id INT NULL,
    order_header_history_id INT NULL,
    service_id INT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Users
CREATE TABLE IF NOT EXISTS `users` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) NULL,
    user_email VARCHAR(255) NULL UNIQUE,
    user_password VARCHAR(255) NULL,
    token VARCHAR(255) NULL,
    token_expiry VARCHAR(255) NULL,
    user_role VARCHAR(255) NULL DEFAULT 'user',
    role_id INT NULL,
    is_active TINYINT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Roles
CREATE TABLE IF NOT EXISTS `roles` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NULL UNIQUE,
    role_description VARCHAR(255) NULL,
    is_active TINYINT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);
-- Permissions
CREATE TABLE IF NOT EXISTS `permissions` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NULL,
    create_services TINYINT NULL DEFAULT 0,
    read_services TINYINT NULL DEFAULT 0,
    update_services TINYINT NULL DEFAULT 0,
    delete_services TINYINT NULL DEFAULT 0,
    create_employees TINYINT NULL DEFAULT 0,
    read_employees TINYINT NULL DEFAULT 0,
    update_employees TINYINT NULL DEFAULT 0,
    delete_employees TINYINT NULL DEFAULT 0,

    create_users TINYINT NULL DEFAULT 0,
    read_users TINYINT NULL DEFAULT 0,
    update_users TINYINT NULL DEFAULT 0,
    delete_users TINYINT NULL DEFAULT 0,
    
    create_orders TINYINT NULL DEFAULT 0,
    read_orders TINYINT NULL DEFAULT 0,
    update_orders TINYINT NULL DEFAULT 0,
    delete_orders TINYINT NULL DEFAULT 0,

    collect_orders TINYINT NULL DEFAULT 0,
    uncollect_orders TINYINT NULL DEFAULT 0,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL DEFAULT 'Admin',
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(255) NULL
);