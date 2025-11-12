-- Create customization_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS `customization_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_type` enum('t-shirt','jersey','hoodie','sweatshirt') NOT NULL,
  `size` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `color_preference` varchar(100) DEFAULT NULL,
  `design_description` text NOT NULL,
  `status` enum('pending','reviewing','approved','in_progress','completed','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `estimated_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  CONSTRAINT `customization_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create customization_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS `customization_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `image_type` enum('reference','mockup','final') DEFAULT 'reference',
  `description` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `customization_images_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `customization_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create customization_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS `customization_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customization_messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `customization_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `customization_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;