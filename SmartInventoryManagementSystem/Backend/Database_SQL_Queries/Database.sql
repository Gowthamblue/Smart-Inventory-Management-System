-- Create Database
CREATE DATABASE smart_inventory;
USE smart_inventory;

-- User Roles Table
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Users Table (Authentication System)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);

-- Suppliers/Vendors Table
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT
);

-- Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    supplier_id INT,
    price DECIMAL(10,2) NOT NULL,
    available_stock INT DEFAULT 0,
    total_stock INT DEFAULT 100,
    reorder_level INT DEFAULT 10,  -- If stock < 10, generate alert
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

-- Orders Table (Purchase Orders to Suppliers)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

-- Order Items Table (Tracks Products in an Order)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Inventory Table (Tracks Stock in Warehouses)
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    warehouse_id INT,
    stock_quantity INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE
);

-- Warehouses Table (For Multi-Warehouse Support)
CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(255) NOT NULL,
    location TEXT
);

-- Low Stock Alerts Table
CREATE TABLE low_stock_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    alert_message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Billing History (Customer Purchase Records)
CREATE TABLE billing_history (
    billing_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Invoice History (Generated Invoices for Purchases)
CREATE TABLE invoice_history (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);





-- Insert Roles
INSERT INTO roles (role_name) VALUES ('Admin'), ('Manager'), ('Staff');

-- Insert Users
INSERT INTO users (username, email, password_hash, role_id) VALUES
('admin', 'admin@example.com', 'hashedpassword1', 1),
('manager1', 'manager@example.com', 'hashedpassword2', 2),
('staff1', 'staff@example.com', 'hashedpassword3', 3);

-- Insert Suppliers
INSERT INTO suppliers (name, contact_email, contact_phone, address) VALUES
('ABC Suppliers', 'abc@gmail.com', '9876543210', 'Chennai'),
('XYZ Pvt Ltd', 'xyz@gmail.com', '9876543211', 'Bangalore');

-- Insert Products
INSERT INTO products (product_name, supplier_id, price, available_stock, reorder_level) VALUES
('Laptop', 1, 50000.00, 20, 5),
('Mouse', 2, 500.00, 50, 10),
('Keyboard', 2, 1000.00, 30, 10);

-- Insert Warehouses
INSERT INTO warehouses (warehouse_name, location) VALUES
('Main Warehouse', 'Chennai'),
('Backup Warehouse', 'Bangalore');

-- Insert Inventory Data
INSERT INTO inventory (product_id, warehouse_id, stock_quantity) VALUES
(1, 1, 10), (2, 1, 20), (3, 2, 15);
