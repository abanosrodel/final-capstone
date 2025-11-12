-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2025 at 02:38 AM
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
-- Database: `tatak`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(455) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'T-Shirts', 'Wara gud para nay sul obon', '2025-08-01 03:17:10'),
(2, 'Hoodie', 'Paangay', '2025-08-01 03:17:10'),
(3, 'Sweatshirts', 'For Pa chuychuy', '2025-08-01 03:17:10'),
(4, 'Jerseys', 'For Basketball and pa chuychuy', '2025-08-01 06:12:29'),
(9, 'Cap', 'Cap', '2025-10-08 22:52:54');

-- --------------------------------------------------------

--
-- Table structure for table `customization_images`
--

CREATE TABLE `customization_images` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `image_type` enum('reference','mockup','final') DEFAULT 'reference',
  `description` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customization_messages`
--

CREATE TABLE `customization_messages` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customization_requests`
--

CREATE TABLE `customization_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_type` enum('t-shirt','jersey','hoodie','sweatshirt') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `size` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `color_preference` varchar(100) DEFAULT NULL,
  `design_description` text NOT NULL,
  `special_requirements` text DEFAULT NULL,
  `budget_range` varchar(50) DEFAULT NULL,
  `timeline` varchar(100) DEFAULT NULL,
  `status` enum('pending','reviewing','approved','in_progress','completed','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `quoted_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender` enum('user','admin') NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `sender`, `text`, `created_at`, `image_url`) VALUES
(1, 6, 'user', 'Hello Admin! This is a test.', '2025-08-05 16:34:04', NULL),
(2, 6, 'user', 'hooy admin', '2025-08-05 16:37:16', NULL),
(3, 5, 'user', 'hii seller', '2025-08-05 16:42:29', NULL),
(4, 5, 'user', 'hii', '2025-08-05 16:52:56', NULL),
(5, 5, 'admin', 'Hello, how can I help you?', '2025-08-05 17:19:14', NULL),
(6, 5, 'user', 'patol naka', '2025-08-05 17:30:39', NULL),
(7, 5, 'admin', 'ikaw patol', '2025-08-05 17:30:50', NULL),
(8, 6, 'admin', 'oo?', '2025-08-05 17:40:37', NULL),
(9, 6, 'user', 'mao rato inyong baligya?', '2025-08-05 17:52:18', NULL),
(10, 6, 'admin', 'oo mao ra', '2025-08-05 17:52:31', NULL),
(11, 6, 'user', 'ahak', '2025-08-05 17:54:52', NULL),
(12, 6, 'admin', 'ari langs shop tapolan ay', '2025-08-05 17:56:08', NULL),
(23, 5, 'admin', 'hi', '2025-08-05 18:37:52', NULL),
(26, 6, 'admin', 'shessh', '2025-08-05 18:42:21', '/uploads/1754419341822.jpg'),
(27, 6, 'user', 'maot', '2025-08-05 18:42:36', NULL),
(28, 6, 'user', 'kana?', '2025-08-05 18:44:24', NULL),
(29, 6, 'admin', 'taka ra', '2025-08-05 18:44:36', NULL),
(30, 6, 'user', 'ikaw', '2025-08-05 18:49:03', NULL),
(31, 6, 'admin', 'hahaah', '2025-08-05 18:49:24', NULL),
(32, 6, 'user', 'try', '2025-08-05 18:51:37', NULL),
(33, 6, 'admin', 'ge daw', '2025-08-05 18:51:49', NULL),
(34, 6, 'admin', 'ahh', '2025-08-05 18:54:30', NULL),
(35, 6, 'user', 'sheesh', '2025-08-05 18:55:02', NULL),
(36, 6, 'admin', 'tala', '2025-08-05 18:55:11', NULL),
(37, 6, 'admin', 'haha', '2025-08-05 18:55:59', NULL),
(38, 6, 'user', 'jajaja', '2025-08-05 18:58:43', NULL),
(39, 6, 'admin', 'wahahaha', '2025-08-05 18:58:49', NULL),
(40, 6, 'user', 'sehshs', '2025-08-05 19:07:17', NULL),
(41, 6, 'admin', 'amaaw', '2025-08-05 19:07:22', NULL),
(42, 6, 'admin', 'dadas', '2025-08-05 19:08:24', NULL),
(43, 6, 'admin', 'hi', '2025-08-05 19:12:06', NULL),
(44, 6, 'user', 'low', '2025-08-05 19:12:11', NULL),
(45, 6, 'admin', 'ddsd', '2025-08-05 19:14:42', NULL),
(46, 6, 'admin', 'sas', '2025-08-05 19:20:34', NULL),
(47, 6, 'user', 'haha', '2025-08-05 19:22:26', NULL),
(48, 6, 'admin', 'ahh', '2025-08-05 19:23:00', NULL),
(49, 6, 'admin', 'adddd', '2025-08-05 19:25:45', NULL),
(50, 6, 'user', 'ahh', '2025-08-05 19:31:34', NULL),
(51, 6, 'admin', 'oo', '2025-08-05 19:31:45', NULL),
(52, 6, 'user', 'ahh', '2025-08-05 19:35:10', NULL),
(53, 6, 'admin', 'ok', '2025-08-05 19:35:16', NULL),
(54, 6, 'admin', 'ahh', '2025-08-05 19:40:41', NULL),
(55, 5, 'admin', 'ok', '2025-08-05 19:40:46', NULL),
(56, 6, 'user', 'ge', '2025-08-05 19:40:57', NULL),
(57, 6, 'admin', 'ok', '2025-08-05 19:41:03', NULL),
(58, 6, 'user', 'ahh', '2025-08-05 19:45:08', NULL),
(59, 6, 'admin', 'hahahah', '2025-08-05 19:45:22', NULL),
(60, 6, 'user', 'hhaha', '2025-08-12 05:19:01', NULL),
(61, 6, 'user', 'samani', '2025-08-12 05:19:13', NULL),
(62, 6, 'user', 'haha', '2025-08-12 05:21:52', NULL),
(63, 6, 'user', 'kani?', '2025-08-12 05:22:11', '/uploads/1754976131717.jpg'),
(64, 6, 'admin', 'nice man', '2025-08-12 05:22:41', NULL),
(65, 6, 'user', 'aw', '2025-08-12 05:23:09', NULL),
(66, 6, 'user', 'nice', '2025-08-12 05:36:48', NULL),
(67, 6, 'admin', 'ss', '2025-08-12 05:36:58', NULL),
(68, 6, 'user', 'ahh', '2025-08-12 16:59:31', NULL),
(69, 6, 'admin', 'hahah', '2025-08-12 16:59:57', NULL),
(70, 6, 'user', 'aw', '2025-08-12 19:01:11', NULL),
(71, 6, 'admin', 'sure ba', '2025-08-12 19:01:35', NULL),
(72, 6, 'admin', 'ahh', '2025-08-12 19:01:48', NULL),
(73, 6, 'admin', 'a', '2025-08-12 19:02:36', NULL),
(74, 6, 'user', 'oo', '2025-08-12 19:03:08', NULL),
(75, 6, 'admin', 'aw', '2025-08-12 19:03:11', NULL),
(76, 6, 'admin', 'aw', '2025-08-12 19:03:15', NULL),
(77, 6, 'user', 'shh', '2025-08-12 19:03:20', NULL),
(78, 6, 'user', 'add', '2025-08-12 19:03:26', NULL),
(79, 6, 'user', 'shh', '2025-08-12 19:10:24', NULL),
(80, 6, 'admin', 'bang', '2025-08-12 19:10:34', NULL),
(81, 6, 'admin', 'labaw', '2025-08-12 19:11:21', NULL),
(82, 6, 'user', 'ahhh', '2025-08-12 19:13:42', NULL),
(83, 6, 'admin', 'takaa', '2025-08-12 19:13:46', NULL),
(84, 8, 'user', 'hoooyy bag o na acc', '2025-08-13 07:01:40', NULL),
(85, 8, 'admin', 'ok', '2025-08-13 07:02:59', NULL),
(86, 6, 'admin', 'aw', '2025-08-13 07:32:27', '/uploads/1755070347790.png'),
(87, 6, 'user', '😍', '2025-08-13 07:33:01', NULL),
(88, 6, 'user', 'hi', '2025-10-08 23:11:44', NULL),
(89, 6, 'admin', 'hello', '2025-10-08 23:11:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(18, 6, 'Your order #28 (BINI shirt) status is now Pending', 1, '2025-08-12 19:14:25'),
(19, 6, 'Your order #28 (BINI shirt) status is now Pending', 1, '2025-08-12 19:21:59'),
(20, 6, 'Your order #28 (BINI shirt) status is now Shipped', 1, '2025-08-13 07:44:13'),
(21, 6, 'Your order #28 (BINI shirt) status is now Delivered', 1, '2025-10-08 23:13:17'),
(22, 6, 'Your order #28 (BINI shirt) status is now Delivered', 1, '2025-10-08 23:20:24');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `shipping_method` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `shipping_fee` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('COD','GCash','PayPal') DEFAULT 'COD',
  `order_status` enum('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `payment_status` enum('Unpaid','Paid') DEFAULT 'Unpaid',
  `total` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gcash_reference` varchar(255) DEFAULT NULL,
  `proof_of_payment` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `contact_email`, `contact_number`, `shipping_method`, `subtotal`, `shipping_fee`, `payment_method`, `order_status`, `payment_status`, `total`, `created_at`, `gcash_reference`, `proof_of_payment`, `first_name`, `last_name`, `city`, `postal_code`, `address`) VALUES
(20, 6, 'kate@gmail.com', '09568692103', 'Store Pick-up', 1398.00, 0.00, 'GCash', 'Delivered', 'Paid', 1398.00, '2025-08-04 09:01:49', '1234657890', '/uploads/1754298109291.jpg', NULL, NULL, NULL, NULL, NULL),
(22, 6, 'kate@gmail.com', '09568692103', 'Delivery', 6699.00, 50.00, 'GCash', 'Cancelled', 'Unpaid', 6749.00, '2025-08-04 09:35:41', '1234567890', '/uploads/1754300141899.jpg', 'Honey Kate', 'Padilla', 'Lapu-lapu City', '6017', 'Bangkal Lapu-lapu I LOVE YOU INDAAAY'),
(23, 1, 'juan@example.com', '09171234567', 'Delivery', 699.00, 50.00, 'GCash', 'Delivered', 'Paid', 749.00, '2025-08-03 02:00:00', 'GCASHREF001', 'proof1.jpg', 'Juan', 'Dela Cruz', 'Cebu City', '6000', '123 Mango St'),
(24, 2, 'maria@example.com', '09981234567', 'Pickup', 500.00, 0.00, '', 'Shipped', 'Paid', 500.00, '2025-07-20 06:30:00', NULL, NULL, 'Maria', 'Reyes', 'Lapu-Lapu City', '6015', '456 Sampaguita St'),
(25, 3, 'pedro@example.com', '09181234567', 'Delivery', 899.00, 70.00, 'GCash', 'Shipped', 'Paid', 969.00, '2025-06-10 01:15:00', 'GCASHREF002', 'proof2.png', 'Pedro', 'Santos', 'Mandaue', '6014', '789 Kamagong Ave'),
(26, 4, 'ana@example.com', '09221234567', 'Delivery', 1200.00, 80.00, 'GCash', 'Delivered', 'Paid', 1280.00, '2025-05-22 08:45:00', 'GCASHREF003', 'proof3.jpg', 'Ana', 'Lopez', 'Talisay City', '6045', '10 Narra Blvd'),
(27, 5, 'karen@example.com', '09123456789', 'Pickup', 299.00, 0.00, '', 'Delivered', 'Paid', 299.00, '2025-04-12 03:00:00', NULL, NULL, 'Karen', 'Villanueva', 'Cebu City', '6000', '88 Acacia Lane'),
(28, 6, 'kate@gmail.com', '09568692103', 'Store Pick-up', 500.00, 0.00, 'GCash', 'Delivered', 'Paid', 500.00, '2025-08-04 18:49:17', '1234657890', '/uploads/1754333357332.jpg', NULL, NULL, NULL, NULL, NULL),
(29, 5, 'jungil@gmail.com', '09917198428', 'Delivery', 1299.00, 50.00, 'COD', 'Delivered', 'Paid', 1349.00, '2025-08-05 00:55:31', NULL, NULL, 'Jun Gil', 'Casquejo', 'Cebu', '6017', 'Poblacion Cordova Cebu');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `size_id`, `quantity`, `unit_price`) VALUES
(10, 20, 1, 1, 1, 499.00),
(11, 20, 2, 4, 1, 899.00),
(13, 22, 11, 3, 2, 3000.00),
(15, 28, 18, 3, 1, 500.00),
(16, 29, 21, 2, 1, 899.00),
(17, 29, 22, 3, 1, 400.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `unit_price`, `image`, `description`, `created_at`) VALUES
(1, 'Basic White T-Shirt', 1, 499.00, '[\"1754039066966.png\"]', 'High quality cotton white t-shirt', '2025-08-01 03:17:10'),
(2, 'Brown Shirt', 1, 300.00, '[\"1754326403153.png\"]', 'Cozy black hoodie for cold weather', '2025-08-01 03:17:10'),
(4, 'Gilas Shirt ', 1, 399.00, '[\"1754326423468.png\"]', 'Diha rang laay', '2025-08-01 07:16:02'),
(10, 'Premium Shirt ', 1, 500.00, '[\"1754232276546.png\"]', 'dasdasdasdasd', '2025-08-01 08:49:12'),
(11, 'GSW CITY JERSEY', 4, 3000.00, '[\"1754240631392.jpg\"]', 'Original Stephen Curry City Jersey', '2025-08-03 15:27:37'),
(12, 'Nike Sweatshirt', 3, 499.00, '[\"1754326519496.jpg\"]', 'Nike Sweatshirt Unisex', '2025-08-04 16:55:19'),
(13, 'OverSized Tshirt', 1, 380.00, '[\"1754326595104.jpg\"]', 'High Quality Korean Style OverSized Tshirt', '2025-08-04 16:56:35'),
(14, 'Gucci Black T-Shirt', 1, 700.00, '[\"1754326674544.jpg\"]', 'Original Gucci Black T-Shirt ', '2025-08-04 16:57:54'),
(15, 'Black T-Shirt', 1, 550.00, '[\"1754326836778.jpg\"]', 'Do What Makes You Happy Shirt', '2025-08-04 17:00:36'),
(16, 'Blue Hoodie', 2, 690.00, '[\"1754326918313.jpg\"]', 'Premium BlueHoodie', '2025-08-04 17:01:58'),
(17, 'TimberWolves Jersey', 4, 2000.00, '[\"1754327034905.jpg\"]', 'Original Nba Jersey Imported form US', '2025-08-04 17:03:54'),
(18, 'BINI shirt', 1, 500.00, '[\"1754327088400.jpg\"]', 'Original Bini Shirt from Bini Website', '2025-08-04 17:04:48'),
(19, 'Printed Black Shirt', 1, 699.00, '[\"1754327143975.jpg\"]', 'Playboi Shirt shit', '2025-08-04 17:05:43'),
(20, 'Hip-hop Shirt', 1, 599.00, '[\"1754327181760.jpg\"]', 'Hip-hop Shirt Para sa Mga Dancerists', '2025-08-04 17:06:21'),
(21, 'Black Bini Hoodie', 2, 899.00, '[\"1754327402176.jpg\"]', 'Official Bini Hoodie', '2025-08-04 17:10:02'),
(22, 'One Piece Shirt', 1, 400.00, '[\"1754327455672.jpeg\"]', 'Premium One Piece Shirt', '2025-08-04 17:10:55'),
(23, 'Nike Air Cap', 9, 800.00, '[\"1759964245171.jpg\"]', 'Jordan Cap', '2025-10-08 22:57:13');

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size_id`, `stock_quantity`) VALUES
(1, 1, 1, 50),
(2, 1, 2, 100),
(3, 1, 3, 30),
(4, 2, 2, 25),
(10, 11, 3, 5),
(11, 4, 3, 10),
(12, 4, 2, 10),
(13, 4, 1, 10),
(14, 11, 2, 10),
(15, 10, 3, 10),
(16, 10, 2, 10),
(17, 10, 1, 10),
(18, 12, 3, 10),
(19, 12, 2, 10),
(20, 13, 3, 10),
(21, 13, 2, 10),
(22, 14, 3, 10),
(23, 14, 2, 10),
(24, 15, 3, 10),
(25, 15, 4, 5),
(26, 15, 1, 12),
(27, 16, 3, 10),
(28, 16, 2, 10),
(29, 16, 1, 10),
(30, 17, 4, 5),
(31, 17, 3, 15),
(32, 18, 3, 10),
(33, 18, 2, 10),
(34, 19, 4, 10),
(35, 19, 3, 10),
(36, 20, 3, 10),
(37, 20, 2, 10),
(38, 20, 4, 5),
(39, 21, 3, 10),
(40, 21, 2, 10),
(41, 21, 1, 10),
(42, 22, 1, 10),
(43, 22, 3, 10),
(44, 22, 2, 15),
(45, 23, 1, 50);

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `label`, `description`, `created_at`) VALUES
(1, 'S', 'Small', '2025-08-01 03:17:10'),
(2, 'M', 'Medium', '2025-08-01 03:17:10'),
(3, 'L', 'Large', '2025-08-01 03:17:10'),
(4, 'XL', 'Extra Large', '2025-08-01 03:17:10'),
(7, 'XS', 'Extra Small', '2025-08-01 06:42:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_seen_message_id` int(11) DEFAULT 0,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  `is_restricted` tinyint(1) NOT NULL DEFAULT 0,
  `restricted_at` datetime DEFAULT NULL,
  `restricted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `lastname`, `firstname`, `email`, `phonenumber`, `address`, `city`, `postal_code`, `password`, `role`, `created_at`, `last_seen_message_id`, `reset_token`, `reset_expires`, `email_verified`, `otp_code`, `otp_expires`, `is_restricted`, `restricted_at`, `restricted_by`) VALUES
(1, 'Dela Cruz', 'Juan', 'juan@gmail.com', '09171234567', '123 Main St', 'Manila', '1000', 'hashedpassword', 'customer', '2025-08-01 03:17:10', 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(2, 'Reyes', 'Maria', 'maria@gmail.com', '09181234567', '456 Park Ave', 'Cebu', '6000', 'hashedpassword', 'customer', '2025-08-01 03:17:10', 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(3, 'Admin', 'User', 'admin@gmail.com', '09991234567', 'Admin Office', 'Davao', '8000', 'adminpass', 'admin', '2025-08-01 03:17:10', 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(4, 'Doe', 'John', 'john@example.com', '09123456789', NULL, NULL, NULL, '$2b$10$0encr1yfxQUFj5pvmuljsO.IzvaejEvmeN6/wz5dOvpf8YuElVGii', 'customer', '2025-08-01 03:45:45', 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(5, 'Casquejo', 'Jun Gil', 'jungil@gmail.com', '09917198428', 'Poblacion Cordova Cebu', 'Cebu', '6017', '$2b$10$V/wcebZwtzzCAyiyANafueZyOKyUtEakBUx3ocg7ZswKM7GQ/lcU6', 'customer', '2025-08-01 03:48:46', 7, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(6, 'Padilla', 'Honey Kate', 'kate@gmail.com', '09568692103', 'Bangkal Lapu-lapu', 'Lapu-lapu City', '6017', '$2b$10$n4O3MYArrYceCAFKfeW2OuePc6KH8sRZ9ooKh7IgUeb9pTXq6dpAC', 'customer', '2025-08-01 04:29:18', 88, '154b52c3a1ea6af02b20324e8329dfc7323c99cbaf4bb680040190a3607055dc', '2025-08-13 14:46:52', 0, NULL, NULL, 0, NULL, NULL),
(7, 'min', 'Ad', 'admin@tatak.com', NULL, NULL, NULL, NULL, '$2b$10$zpLlOmuv3S.yq9C6QLN2AO2FWxF1m/l55kY9MH/EVrRiURHr9TrSm', 'admin', '2025-08-01 05:16:24', 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL),
(8, 'Casquejo', 'Jun Gil', 'jungilcasquejo5@gmail.com', '0991719840', 'Catarman Cordova Cebu', 'Cebu', '6017', '$2b$10$Y3as.mQJFxiymSvkVtCqh.JauWu60bntkTkQo27vDxhPcbuxBniv.', 'customer', '2025-08-13 05:48:26', 84, '3b702814a3af80979994dd9b9ff42c1293162951589fa601c3bedbcc3898094c', '2025-10-09 08:30:12', 0, NULL, NULL, 0, NULL, NULL),
(15, 'Casquejo', 'Dondon', 'dondonborres1@gmail.com', NULL, NULL, NULL, NULL, '$2b$10$ZWKjQZp/JcISqO4rBxI10ed9uYmZ3sIbrbohUkXSgLlNQAYokVQfa', 'customer', '2025-10-08 23:54:01', 0, '843e3c6f338ecb2be9dad9d96d981023e451a9040bb40b6056a2eba679825f6b', '2025-10-09 08:56:20', 1, NULL, NULL, 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customization_images`
--
ALTER TABLE `customization_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `customization_messages`
--
ALTER TABLE `customization_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customization_requests`
--
ALTER TABLE `customization_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
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
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customization_images`
--
ALTER TABLE `customization_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customization_messages`
--
ALTER TABLE `customization_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customization_requests`
--
ALTER TABLE `customization_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customization_images`
--
ALTER TABLE `customization_images`
  ADD CONSTRAINT `customization_images_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `customization_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customization_messages`
--
ALTER TABLE `customization_messages`
  ADD CONSTRAINT `customization_messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `customization_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customization_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customization_requests`
--
ALTER TABLE `customization_requests`
  ADD CONSTRAINT `customization_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_sizes_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
