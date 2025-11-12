-- Add customization_data column to orders table
ALTER TABLE orders ADD COLUMN customization_data TEXT DEFAULT NULL;
