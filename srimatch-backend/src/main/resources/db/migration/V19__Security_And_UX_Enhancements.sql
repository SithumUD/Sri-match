-- V19: Security and UX Enhancements (PostgreSQL)

-- 1. Security: Increase totp_secret length to store AES-256-GCM encrypted ciphertext
ALTER TABLE users ALTER COLUMN totp_secret TYPE VARCHAR(500);

-- 2. Security: Ensure refresh_tokens token column accommodates SHA-256 hex hashes (64 chars)
ALTER TABLE refresh_tokens ALTER COLUMN token TYPE VARCHAR(255);

-- 3. Security: Ensure jwt_blacklist token column accommodates SHA-256 hex hashes (64 chars)
ALTER TABLE jwt_blacklist ALTER COLUMN token TYPE VARCHAR(255);

-- 4. UX: Add read_receipts_enabled privacy control setting to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS read_receipts_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- 5. UX: Extend payments table with estimated review time and improved rejection tracking
ALTER TABLE payments ADD COLUMN IF NOT EXISTS estimated_review_hours INT DEFAULT 24;

-- 6. Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_read_receipts ON users (read_receipts_enabled);
CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_token_hash ON jwt_blacklist (token);
