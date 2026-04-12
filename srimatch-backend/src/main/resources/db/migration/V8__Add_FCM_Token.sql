-- Add fcm_token column to users table for push notifications
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(255);

-- Create index for performance
CREATE INDEX idx_user_fcm_token ON users(fcm_token);
