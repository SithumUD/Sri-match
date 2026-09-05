-- V9__Add_Precise_Birth_Information.sql (PostgreSQL)

ALTER TABLE profiles 
ADD COLUMN time_of_birth TIME DEFAULT NULL,
ADD COLUMN latitude DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN longitude DOUBLE PRECISION DEFAULT NULL;

-- Indices for potential future geo-queries
CREATE INDEX idx_birth_coordinates ON profiles(latitude, longitude);
