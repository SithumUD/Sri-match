-- V17: Extend payments table to support boost package purchases (PostgreSQL)

-- 1. Make subscription_id nullable
ALTER TABLE payments ALTER COLUMN subscription_id DROP NOT NULL;

-- 2. Add boost_package_id foreign key
ALTER TABLE payments ADD COLUMN boost_package_id BIGINT;
ALTER TABLE payments ADD CONSTRAINT fk_payment_boost_package
    FOREIGN KEY (boost_package_id) REFERENCES boost_packages(id) ON DELETE SET NULL;

-- 3. Add payment_type discriminator column
ALTER TABLE payments ADD COLUMN payment_type VARCHAR(30) NOT NULL DEFAULT 'SUBSCRIPTION';
