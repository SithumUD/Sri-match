-- ==============================================================================
-- V22: Add TikTok Package and TikTok Promotion Tables (PostgreSQL 16)
-- ==============================================================================

-- 1. Create tiktok_packages table
CREATE TABLE IF NOT EXISTS tiktok_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    offer_percentage INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create tiktok_promotions table
CREATE TABLE IF NOT EXISTS tiktok_promotions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tiktok_package_id BIGINT NOT NULL,
    payment_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    tiktok_post_url VARCHAR(500),
    admin_notes TEXT,
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITHOUT TIME ZONE,
    expires_at TIMESTAMP WITHOUT TIME ZONE,
    processed_by BIGINT,
    CONSTRAINT fk_tiktok_promo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tiktok_promo_package FOREIGN KEY (tiktok_package_id) REFERENCES tiktok_packages(id) ON DELETE CASCADE,
    CONSTRAINT fk_tiktok_promo_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CONSTRAINT fk_tiktok_promo_processed_by FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tiktok_promo_user ON tiktok_promotions(user_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_promo_status ON tiktok_promotions(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_promo_expires ON tiktok_promotions(expires_at);

-- 3. Extend payments table with tiktok_promotion_id foreign key
ALTER TABLE payments ADD COLUMN IF NOT EXISTS tiktok_promotion_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_tiktok_promotion'
    ) THEN
        ALTER TABLE payments ADD CONSTRAINT fk_payment_tiktok_promotion
            FOREIGN KEY (tiktok_promotion_id) REFERENCES tiktok_promotions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Seed initial TikTok promotion packages if none exist
INSERT INTO tiktok_packages (name, description, price, duration_days, offer_percentage, is_active, created_at, updated_at)
SELECT 'TikTok Starter Spotlight', 'Feature your matrimonial profile in a dedicated short-form video on SriMatch official TikTok channel for 7 days.', 1500.00, 7, 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tiktok_packages WHERE name = 'TikTok Starter Spotlight');

INSERT INTO tiktok_packages (name, description, price, duration_days, offer_percentage, is_active, created_at, updated_at)
SELECT 'TikTok Premium Reach', 'High-priority TikTok video showcase with pinned comment, link in bio, and 14 days active promotion.', 2800.00, 14, 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tiktok_packages WHERE name = 'TikTok Premium Reach');

INSERT INTO tiktok_packages (name, description, price, duration_days, offer_percentage, is_active, created_at, updated_at)
SELECT 'TikTok VIP Viral Spotlight', 'Maximum exposure across TikTok & Instagram Reels for 30 days with custom video edit and priority matching.', 4900.00, 30, 20, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tiktok_packages WHERE name = 'TikTok VIP Viral Spotlight');
