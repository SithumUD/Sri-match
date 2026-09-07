-- Flyway Migration V23: Remove district and time_of_birth from profiles

-- Drop index on district if exists
DROP INDEX IF EXISTS idx_district;

-- Drop district column
ALTER TABLE profiles DROP COLUMN IF EXISTS district;

-- Drop time_of_birth column
ALTER TABLE profiles DROP COLUMN IF EXISTS time_of_birth;
