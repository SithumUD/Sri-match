-- V16: Add Profile Boost System (PostgreSQL)

-- 1. Add boost-related columns to users table
ALTER TABLE users ADD COLUMN boost_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN last_boost_renew_at TIMESTAMP;

-- 2. Add boost-related column to profiles table
ALTER TABLE profiles ADD COLUMN boost_expires_at TIMESTAMP;

-- 3. Create boost_packages table
CREATE TABLE boost_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    boost_count INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 4. Initial boost packages
INSERT INTO boost_packages (name, description, price, boost_count, is_active, created_at, updated_at)
VALUES 
('Single Boost', 'Get 1 profile boost to increase your visibility for 1 hour.', 199.00, 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Boost Pack (5)', 'Get 5 profile boosts and save 10%.', 899.00, 5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Boost Pack (10)', 'Get 10 profile boosts and save 20%. Best value!', 1599.00, 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
