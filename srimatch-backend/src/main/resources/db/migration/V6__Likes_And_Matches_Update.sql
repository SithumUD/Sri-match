-- V6: Update Likes and Matches for 5-day cycle and Star Likes (PostgreSQL)

-- Rename daily_like_limit -> like_limit
ALTER TABLE users RENAME COLUMN daily_like_limit TO like_limit;
ALTER TABLE users ALTER COLUMN like_limit SET DEFAULT 15;

-- Rename likes_today -> likes_used
ALTER TABLE users RENAME COLUMN likes_today TO likes_used;
ALTER TABLE users ALTER COLUMN likes_used SET DEFAULT 0;

-- Update existing data to reflect new default if it was 20
UPDATE users SET like_limit = 15 WHERE like_limit = 20;

-- Update likes table
ALTER TABLE likes ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'NORMAL';

CREATE INDEX idx_likes_type ON likes (type);
