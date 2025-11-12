-- Add email verification fields to users table
ALTER TABLE `users` 
ADD COLUMN `email_verified` BOOLEAN DEFAULT FALSE,
ADD COLUMN `otp_code` VARCHAR(6) DEFAULT NULL,
ADD COLUMN `otp_expires` DATETIME DEFAULT NULL;
