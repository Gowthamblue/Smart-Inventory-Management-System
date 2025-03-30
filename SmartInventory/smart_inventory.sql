-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2025 at 08:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `billing_history`
--

CREATE TABLE `billing_history` (
  `billing_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `date_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing_history`
--

INSERT INTO `billing_history` (`billing_id`, `product_id`, `product_name`, `quantity`, `total_price`, `date_time`) VALUES
(1, 4, 'Product D', 1, 500.00, '2025-02-11 18:08:25'),
(2, 1, 'Product A', 5, 1000.00, '2025-02-11 18:35:55');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_history`
--

CREATE TABLE `invoice_history` (
  `invoice_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_history`
--

INSERT INTO `invoice_history` (`invoice_id`, `product_id`, `product_name`, `quantity`, `total_price`, `date_time`) VALUES
(1, 4, 'Product D', 1, 500.00, '2025-02-11 12:57:19'),
(2, 4, 'Product D', 1, 500.00, '2025-02-11 13:02:15'),
(3, 4, 'Product D', 1, 500.00, '2025-02-11 13:05:25');

-- --------------------------------------------------------

--
-- Table structure for table `low_stock_alerts`
--

CREATE TABLE `low_stock_alerts` (
  `alert_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `alert_message` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `order_id` int(11) NOT NULL,
  `available_stock` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_stock` int(11) NOT NULL DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `order_id`, `available_stock`, `price`, `total_stock`) VALUES
(1, 'Product A', 101, 36, 200.00, 100),
(2, 'Product B', 102, 12, 150.00, 100),
(3, 'Product C', 103, 5, 300.00, 100),
(4, 'Product D', 104, 4, 500.00, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billing_history`
--
ALTER TABLE `billing_history`
  ADD PRIMARY KEY (`billing_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `invoice_history`
--
ALTER TABLE `invoice_history`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `low_stock_alerts`
--
ALTER TABLE `low_stock_alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billing_history`
--
ALTER TABLE `billing_history`
  MODIFY `billing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoice_history`
--
ALTER TABLE `invoice_history`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `low_stock_alerts`
--
ALTER TABLE `low_stock_alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing_history`
--
ALTER TABLE `billing_history`
  ADD CONSTRAINT `billing_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_history`
--
ALTER TABLE `invoice_history`
  ADD CONSTRAINT `invoice_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `low_stock_alerts`
--
ALTER TABLE `low_stock_alerts`
  ADD CONSTRAINT `low_stock_alerts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
