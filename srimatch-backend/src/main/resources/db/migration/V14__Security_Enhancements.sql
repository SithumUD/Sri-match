-- JWT Blacklist table for token revocation (PostgreSQL)
CREATE TABLE jwt_blacklist (
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_email VARCHAR(100),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jwt_blacklist_token ON jwt_blacklist (token);
CREATE INDEX idx_jwt_blacklist_expiry ON jwt_blacklist (expires_at);

-- Add social login and TOTP fields to users table
ALTER TABLE users
    ADD COLUMN oauth_provider VARCHAR(20),
    ADD COLUMN oauth_provider_id VARCHAR(255),
    ADD COLUMN totp_secret VARCHAR(64),
    ADD COLUMN totp_enabled BOOLEAN NOT NULL DEFAULT FALSE;
