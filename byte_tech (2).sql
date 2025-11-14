-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2025 at 06:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `byte_tech`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `shipping_address` text NOT NULL,
  `contact_number` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `order_date` datetime NOT NULL,
  `status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `full_name`, `email`, `shipping_address`, `contact_number`, `payment_method`, `order_date`, `status`) VALUES
(1, 1, 8498.00, 'A', 'a@gmail.com', '1234 St.', '09876543210', 'cod', '2025-11-15 01:08:31', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) UNSIGNED NOT NULL,
  `order_id` int(11) UNSIGNED NOT NULL,
  `product_id` int(11) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`) VALUES
(1, 1, 3, 'Custom IoT Kits', 1, 4999.00),
(2, 1, 1, 'Automated Garden Watering System', 1, 3499.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `components` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `components`) VALUES
(1, 'Automated Garden Watering System', 'An IoT-powered irrigation setup that automatically waters plants when the soil is dry. Perfect for gardens, greenhouses, or small farms.', 3499.00, 'uploads/1760807149_prod1.png', '\"Arduino Uno R3\",\r\n\"Soil Moisture Sensors (x2)\",\r\n\"Relay Module\",\r\n\"Mini Water Pump\",\r\n\"12V Power Adapter\",\r\n\"Jumper Wires\",\r\n\"Clear PVC Tubing\"'),
(2, 'IoT Monitoring Sensors', 'Real-time monitoring of soil moisture, temperature, and humidity. Ideal for data-driven farming and automation projects.', 2899.00, 'uploads/1760807328_prod2.png', '\"DHT22 Sensor\",\r\n\"Soil Moisture Sensor\",\r\n\"ESP8266 Wi-Fi Module\",\r\n\"Arduino Nano\",\r\n\"OLED Display Module\",\r\n\"Jumper Wires & Breadboard\",\r\n\"Power Cable\"'),
(3, 'Custom IoT Kits', 'Build your own IoT system for agriculture, automation, or research. Flexible and educational setup for all levels.', 4999.00, 'uploads/1760807694_prod3.png', '\"Arduino Uno / ESP8266\",\r\n\"DHT11 / DHT22 Sensor\",\r\n\"Soil Moisture Sensor\",\r\n\"4-Channel Relay Module\",\r\n\"Breadboard & Jumper Wires\",\r\n\"Power Supply\",\r\n\"User Manual / Quick Start Guide\"');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `position`, `created_at`) VALUES
(1, 'Lemuel Castroverde', 'lemuel.castroverde@yahoo.com', '$2y$10$k1R1v34EGvHG1Hb2875U4uSSJxAyMaoQdZhWvMD8As3YB7HzbxxSW', 'user', '2025-10-17 16:41:56'),
(2, 'Lem Castro', 'lmlcastro18@gmail.com', '$2y$10$2/JkDC03FLWdVInEaH4nT.4T3pUQf6klQ4z95vZCMgrOgGnSAOLhS', 'admin', '2025-10-18 15:23:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
