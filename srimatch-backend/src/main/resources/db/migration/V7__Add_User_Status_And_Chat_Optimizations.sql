-- Add online status and last seen fields to users table (PostgreSQL)
ALTER TABLE users ADD COLUMN is_online BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_seen_at TIMESTAMP;

-- Add indexes for performance
CREATE INDEX idx_user_online ON users(is_online);
CREATE INDEX idx_user_last_seen ON users(last_seen_at);
