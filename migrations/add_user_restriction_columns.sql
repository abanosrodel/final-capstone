-- Add user restriction columns (if they don't exist)
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `is_restricted` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `restricted_at` DATETIME DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `restricted_by` INT DEFAULT NULL;
