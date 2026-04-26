-- JWT Blacklist table for token revocation
CREATE TABLE jwt_blacklist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token TEXT NOT NULL,
    user_email VARCHAR(100),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_jwt_expiry (expires_at)
);

-- Add social login fields to users table
ALTER TABLE users
    ADD COLUMN oauth_provider VARCHAR(20) NULL COMMENT 'GOOGLE or FACEBOOK',
    ADD COLUMN oauth_provider_id VARCHAR(255) NULL COMMENT 'ID from OAuth provider',
    ADD COLUMN totp_secret VARCHAR(64) NULL COMMENT 'TOTP secret for admin 2FA',
    ADD COLUMN totp_enabled BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether admin 2FA is enabled';
