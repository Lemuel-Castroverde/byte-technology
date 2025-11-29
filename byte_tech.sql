-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 03:31 AM
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
(4, 'Smart Hydroponics Brain', 'The central nervous system for modern hydroponic farms. It automatically monitors water pH, EC levels, and temperature to dose nutrients precisely.', 8500.00, 'uploads/1764304831_Gemini_Generated_Image_b5o18qb5o18qb5o1.png', 'ESP32 Microcontroller\r\nIndustrial Grade pH Sensor Probe\r\nEC (Conductivity) Sensor\r\nPeristaltic Dosing Pumps (x2)\r\nOLED Status Display\r\nWaterproof Temperature Probe'),
(5, 'Agri-Bot Rover Kit', 'A programmable ground drone chassis designed for autonomous crop monitoring. Capable of navigating rough farm terrain to capture soil data without compacting soil.', 12499.00, 'uploads/1764304964_Gemini_Generated_Image_vmbhv4vmbhv4vmbh.png', '4WD Aluminum Chassis\r\nHigh-Torque DC Geared Motors (x4)\r\nL298N Motor Driver Module\r\nRaspberry Pi Zero W\r\nUltrasonic Obstacle Sensors\r\nLi-Po Battery Pack'),
(6, 'LoRaWAN Farm Gateway', 'Create a private, long-range network for your entire farm. Connects sensors up to 5km away without needing expensive cellular data or Wi-Fi in every field.', 6500.00, 'uploads/1764305038_Gemini_Generated_Image_p2e4x2p2e4x2p2e4.png', 'Dragino LoRa Gateway Module\r\nHigh-Gain Outdoor Antenna (868/915 MHz)\r\nPower over Ethernet (PoE) Adapter\r\nWeatherproof IP67 Enclosure\r\nMounting Bracket'),
(7, 'Solar IoT Node V2', 'A \"set and forget\" sensor node for remote areas. Integrated solar charging allows it to run indefinitely, sending soil moisture data to the cloud.', 3200.00, 'uploads/1764305120_Gemini_Generated_Image_92rb9p92rb9p92rb.png', '6V Monocrystalline Solar Panel\r\n18650 Li-Ion Battery Holder\r\nTP4056 Charging Module\r\nESP8266 Wi-Fi Chip\r\nCapacitive Soil Moisture Sensor'),
(8, 'Auto-Greenhouse Starter', 'A complete automation kit for small greenhouses. Controls fans, lights, and misting systems based on real-time temperature and humidity thresholds', 4800.00, 'uploads/1764305204_Gemini_Generated_Image_qpmke1qpmke1qpmk.png', 'Arduino Mega 2560\r\n8-Channel Relay Module\r\nDS18B20 Waterproof Temp Probe\r\n12V DC Cooling Fan\r\nServo Motors (for Vents)\r\nDHT22 Air Sensor'),
(9, 'Precision Irrigation Valve', 'A smart motorized ball valve that fits standard PVC pipes. Uses zero power once opened, making it perfect for solar-powered irrigation systems.', 1950.00, 'uploads/1764305895_Gemini_Generated_Image_g0g4l2g0g4l2g0g4.png', 'Motorized Ball Valve (3/4 inch)\r\nRF 433MHz Receiver Module\r\nManual Override Switch\r\n12V Power Supply\r\nIP65 Waterproof Housing'),
(10, 'AI Vision Sentry', 'Advanced camera module detecting early signs of crop diseases or pests using Machine Learning. Perfect for Thesis projects or reducing pesticide use.', 7999.00, 'uploads/1764305969_Gemini_Generated_Image_bok74ybok74ybok7.png', 'Raspberry Pi 4 (4GB RAM)\r\nPi Camera Module V2 (8MP)\r\nCoral USB Accelerator (Optional)\r\nPre-loaded Python Detection Scripts\r\nAdjustable Camera Mount'),
(11, 'Soil NPK Analyzer', 'Industrial-grade sensor probe that measures Nitrogen, Phosphorus, and Potassium levels in soil instantly. Helps farmers apply exact fertilizer amounts.', 2100.00, 'uploads/1764306030_Gemini_Generated_Image_u4sy57u4sy57u4sy.png', 'RS485 NPK Sensor Probe\r\nMAX485 TTL to RS485 Module\r\nArduino Nano\r\n0.96\" OLED Screen\r\n9V Battery Connector'),
(12, 'IoT Weather Station', 'Track your farm\'s exact rainfall, wind speed, and atmospheric pressure to make precise planting and harvesting decisions.', 5500.00, 'uploads/1764306119_Gemini_Generated_Image_u39c5xu39c5xu39c.png', 'Anemometer (Wind Speed Sensor)\r\nWind Vane (Direction Sensor)\r\nTipping Bucket Rain Gauge\r\nBME280 Pressure/Humidity Sensor\r\nAluminum Mounting Pole Kit'),
(13, 'ESP32 Student Starter', 'The ultimate starter pack for Computer Engineering students learning IoT. Includes the powerful ESP32 and components for building smart prototypes.', 1250.00, 'uploads/1764306184_Gemini_Generated_Image_i2q910i2q910i2q9.png', 'ESP32-WROOM-32 Dev Board\r\n830-Point Breadboard\r\nDHT11 Temp/Humidity Sensor\r\nLDR Light Sensor\r\nJumper Wires (M-M, M-F)\r\nLEDs, Resistors & Pushbuttons');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `breakdown` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `image_url`, `breakdown`) VALUES
(1, 'System Maintenance', 'Quarterly onsite checkups, sensor calibration, and firmware updates to ensure your IoT ecosystem runs at 99.9% uptime.', 1500.00, 'uploads/1764309830_Gemini_Generated_Image_xf6m4jxf6m4jxf6m.png', 'Sensor calibration and accuracy testing\r\nFirmware security patching and updates\r\nPhysical hardware cleaning and inspection\r\nConnectivity signal strength analysis\r\nBattery health check for remote nodes'),
(2, 'Component Replacement', 'Rapid diagnosis and replacement of faulty sensors, microcontrollers, or actuators to minimize farm downtime.', 850.00, 'uploads/1764309924_Gemini_Generated_Image_wovlurwovlurwovl.png', 'On-site hardware diagnostics\r\nRemoval of defective modules\r\nInstallation of genuine replacement parts\r\nSystem reboot and reintegration\r\nPost-repair functionality stress test'),
(3, 'Farm Layout Design', 'Custom CAD blueprints optimizing sensor placement and wiring paths for your specific farm or greenhouse structure.', 2500.00, 'uploads/1764309996_Gemini_Generated_Image_azzbsdazzbsdazzb.png', 'Digital site survey and mapping\r\nOptimal sensor placement strategy\r\nWiring and conduit path planning\r\nWi-Fi/LoRaWAN coverage heatmap\r\n3D visualization of final setup'),
(4, 'Technical Consultation', 'One-on-one session with our Computer Engineers to architect a smart farming solution tailored to your specific crops.', 1000.00, 'uploads/1764310058_Gemini_Generated_Image_je5omfje5omfje5o.png', 'Crop-specific requirement analysis\r\nIoT architecture planning\r\nCost-benefit and ROI estimation\r\nIntegration with existing farm equipment\r\nTechnology roadmap development'),
(5, 'Staff Training', 'Comprehensive workshop teaching your staff how to interpret IoT data dashboards and perform basic hardware troubleshooting.', 3500.00, 'uploads/1764310157_Gemini_Generated_Image_477mqo477mqo477m.png', 'Dashboard navigation walkthrough\r\nInterpreting soil and weather data\r\nSetting up automated alerts\r\nBasic hardware troubleshooting guide\r\nEmergency system override protocols');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password`, `position`, `created_at`) VALUES
(1, 'Lemuel Castroverde', 'LemUser', 'lemuel.castroverde@yahoo.com', '$2y$10$k1R1v34EGvHG1Hb2875U4uSSJxAyMaoQdZhWvMD8As3YB7HzbxxSW', 'user', '2025-10-17 16:41:56'),
(2, 'Lem Castro', 'LemAdmin', 'lmlcastro18@gmail.com', '$2y$10$2/JkDC03FLWdVInEaH4nT.4T3pUQf6klQ4z95vZCMgrOgGnSAOLhS', 'admin', '2025-10-18 15:23:04');

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
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
