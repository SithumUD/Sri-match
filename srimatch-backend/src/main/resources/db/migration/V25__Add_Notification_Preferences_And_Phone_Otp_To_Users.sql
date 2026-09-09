-- V25: Add notification_preferences and phone OTP verification columns to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "emailMatch": true,
  "emailMessages": true,
  "emailPromo": false,
  "pushMatch": true,
  "pushMessages": true,
  "pushLikes": true,
  "smsSecurity": true
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_otp VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_otp_expires_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_otp_pending VARCHAR(20);

-- Backfill existing users with default notification preferences if NULL
UPDATE users
  SET notification_preferences = '{
    "emailMatch": true,
    "emailMessages": true,
    "emailPromo": false,
    "pushMatch": true,
    "pushMessages": true,
    "pushLikes": true,
    "smsSecurity": true
  }'::jsonb
  WHERE notification_preferences IS NULL;
