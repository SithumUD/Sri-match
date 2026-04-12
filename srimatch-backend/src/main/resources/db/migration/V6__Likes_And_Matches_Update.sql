-- V6: Update Likes and Matches for 5-day cycle and Star Likes
-- Based on the new requirements: 15 likes per 5 days for normal users

-- Rename daily_like_limit -> like_limit (CHANGE COLUMN works on all MariaDB/MySQL versions)
ALTER TABLE users
    CHANGE COLUMN daily_like_limit like_limit INT NOT NULL DEFAULT 15;

-- Rename likes_today -> likes_used
ALTER TABLE users
    CHANGE COLUMN likes_today likes_used INT NOT NULL DEFAULT 0;

-- Update existing data to reflect new default if it was 20
UPDATE users SET like_limit = 15 WHERE like_limit = 20;

-- Update likes table
ALTER TABLE likes
    ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'NORMAL';

CREATE INDEX idx_type ON likes (type);
