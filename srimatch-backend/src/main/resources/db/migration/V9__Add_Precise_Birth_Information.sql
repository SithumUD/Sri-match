-- V9__Add_Precise_Birth_Information.sql

ALTER TABLE profiles 
ADD COLUMN time_of_birth TIME DEFAULT NULL AFTER date_of_birth,
ADD COLUMN latitude DOUBLE DEFAULT NULL AFTER place_of_birth,
ADD COLUMN longitude DOUBLE DEFAULT NULL AFTER latitude;

-- Indices for potential future geo-queries
CREATE INDEX idx_birth_coordinates ON profiles(latitude, longitude);
