-- Add online status and last seen fields to users table
ALTER TABLE users ADD COLUMN is_online BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_seen_at DATETIME;

-- Add indexes for performance
CREATE INDEX idx_user_online ON users(is_online);
CREATE INDEX idx_user_last_seen ON users(last_seen_at);

-- Add delivered_at and status optimizations for messages if not already present
-- The Message entity showed these fields, checking if they exist in schema.
-- According to model, we have status, is_read, is_delivered, read_at, delivered_at.
-- These were likely in V1 or later. I'll stick to user status as requested by the plan.
